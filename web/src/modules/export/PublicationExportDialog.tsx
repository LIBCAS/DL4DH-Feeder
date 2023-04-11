import { useKeycloak } from '@react-keycloak/web';
import { useFormik } from 'formik';
import { FC, useCallback } from 'react';
import { MdClose, MdDownload, MdInfo } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import SelectInput from 'components/form/select/SelectInput';
import SimpleSelect from 'components/form/select/SimpleSelect';
import ModalDialog from 'components/modal';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import RadioButton from 'components/styled/RadioButton';
import Text, { H1 } from 'components/styled/Text';
import { EditSelectedChildren } from 'components/tiles/TilesWithCheckbox';
import TextInput from 'components/form/input/TextInput';

import { usePublicationContext2 } from 'modules/publication/ctx/pubContext';
import { useParseUrlIdsAndParams } from 'modules/publication/publicationUtils';

import { api } from 'api';

import {
	AltoParam,
	altoParamsOptions,
	Delimiter,
	ExportFieldOption,
	exportFieldOptions,
	ExportFilter,
	ExportFilterEQ,
	ExportFormatOption,
	ExportSort,
	NameTagExportOption,
	PipeParam,
	TagParam,
	udPipeParamsOptions,
	useNameTagParamExportOptions,
} from './exportModels';

export type ExportFormType = {
	format: ExportFormatOption;
	includeFields: ExportFieldOption[];
	excludeFields: ExportFieldOption[];
	delimiter: Delimiter;
	exportAll: boolean;
	isSecond?: boolean;
	altoParams?: AltoParam[];
	nameTagParams?: NameTagExportOption[];
	udPipeParams?: PipeParam[];
	pagesFilter: string[];
	exportName: string;
};

export type ExportParasConfig = {
	params: {
		disablePagination?: boolean;
		paging?: {
			pageOffset?: number;
			pageSize?: number;
		};

		sorting?: ExportSort[];
		filters?: ExportFilter[];
		includeFields?: string[];
		excludeFields?: string[];
		delimiter?: Delimiter;
	};
	teiExportParams?: {
		udPipeParams?: PipeParam[];
		altoParams?: AltoParam[];
		nameTagParams?: TagParam[];
	};
	jobType: string;
};

export type ExportParamsDto = {
	config: ExportParasConfig;
	publicationIds: string[];
};

export enum delimiterEnum {
	comma = ',',
	tab = '\t',
}

export const commonFormatOptions: ExportFormatOption[] = [
	{ label: 'TEXT', id: 'text' },
	{ label: 'ALTO', id: 'alto' },
];

export const enrichedFormatOptions: ExportFormatOption[] = [
	{ label: 'JSON', id: 'json' },
	{ label: 'TEXT', id: 'text' },
	{ label: 'TEI', id: 'tei' },
	{ label: 'CSV', id: 'csv' },
	{ label: 'ALTO', id: 'alto' },
];

type Props = {
	closeModal: () => void;
};

export const formatValues = (values: ExportFormType): ExportParasConfig => {
	const common: { sorting: never[]; filters: ExportFilter[] } = {
		sorting: [],
		filters:
			values.pagesFilter.length > 0
				? [{ operation: 'OR', filters: [] as ExportFilterEQ[] }]
				: [],
	};
	if (values.pagesFilter.length > 0) {
		values.pagesFilter.forEach(pf =>
			common.filters[0].filters.push({
				operation: 'EQ',
				value: pf,
				field: '_id',
			}),
		);
	}

	const format = values.format.id;
	if (format === 'alto' || format === 'text') {
		return {
			params: { ...common },
			jobType: 'EXPORT_' + values.format.id.toUpperCase(),
		};
	}
	if (format === 'json') {
		return {
			params: {
				...common,
				includeFields: values.includeFields.map(f => f.id),
				excludeFields: values.excludeFields.map(f => f.id),
			},
			jobType: 'EXPORT_' + values.format.id.toUpperCase(),
		};
	}

	if (format === 'csv') {
		return {
			params: {
				...common,
				includeFields: values.includeFields.map(f => f.id),
				excludeFields: values.excludeFields.map(f => f.id),
				delimiter: values.delimiter,
			},
			jobType: 'EXPORT_' + values.format.id.toUpperCase(),
		};
	}

	if (format === 'tei') {
		return {
			params: {
				...common,
			},
			teiExportParams: {
				altoParams: values.altoParams,
				nameTagParams: values.nameTagParams?.map(nt => nt.id),
				udPipeParams: values.udPipeParams,
			},
			jobType: 'EXPORT_' + values.format.id.toUpperCase(),
		};
	}

	return {
		params: { ...common },
		jobType: 'EXPORT_' + values.format.id.toUpperCase(),
	};
};

//TODO: "Upravit - pocet publikaci textace"

export const ExportForm: FC<Props> = ({ closeModal }) => {
	const { keycloak } = useKeycloak();

	const { t } = useTranslation();

	const { getApropriateIds } = useParseUrlIdsAndParams();
	const { id } = getApropriateIds();

	//const { id: paramId } = useParams<{ id: string }>();
	const { labelFromOption, nameTagParamsExportOptions } =
		useNameTagParamExportOptions();
	const pctx = usePublicationContext2();
	const pubId = id ?? 'ctx-id-undefined';
	const pubTitle = pctx.publication?.title ?? 'unknown';
	const enriched = pctx.publication?.enriched ?? false;
	const formatOptions: ExportFormatOption[] = enriched
		? enrichedFormatOptions
		: commonFormatOptions;

	const getPreselectedChildren = useCallback(
		(pagesFilter: string[]) => {
			if (pagesFilter.length > 0) {
				return pagesFilter;
			}
			return (
				pctx.filtered.isActive
					? pctx.filtered.filteredChildren ?? []
					: pctx.publicationChildren ?? []
			).map(p => p.pid);
		},
		[pctx],
	);

	const formik = useFormik<ExportFormType>({
		initialValues: {
			format: formatOptions[0],
			includeFields: [],
			excludeFields: [],
			exportAll: false,
			delimiter: delimiterEnum.comma,
			pagesFilter: [],
			exportName: '',
		},

		onSubmit: async values => {
			const config = formatValues(values);
			const json: ExportParamsDto = { config, publicationIds: [pubId] };

			const exportName = values.exportName.trim();

			try {
				const response = await api().post(
					`exports/generate?name=${exportName}`,
					{ json },
				);

				if (response.status === 200) {
					toast.info(
						'Požadavka na export byla úspěšně vytvořena. Její stav můžete zkontrolovat na podstránke Exporty.',
						{ autoClose: 10000 },
					);
					closeModal();
				} else {
					toast.error(
						`Při zadávaní exporto nastala chyba. \n ${response.status}`,
					);
				}

				closeModal();
			} catch (error) {
				toast.error(`Při zadávaní exporto nastala chyba. \n ${error}`);
				console.log({ error });
			}
		},
	});

	if (!keycloak.authenticated) {
		return (
			<Flex
				alignItems="center"
				justifyContent="center"
				overflow="visible"
				m={5}
			>
				<Paper
					bg="paper"
					maxWidth={600}
					minWidth={['initial', 500]}
					overflow="visible"
				>
					<Box>
						<Flex width={1} justifyContent="space-between" alignItems="center">
							<H1 my={3}>Exportovat publikaci</H1>
							<IconButton color="primary" onClick={closeModal}>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						<Text>Pro export je nutné se přihlásit</Text>
						<Button
							variant="primary"
							onClick={() => {
								keycloak.login();
							}}
						>
							Přihlásit se
						</Button>
					</Box>
				</Paper>
			</Flex>
		);
	}

	const { handleSubmit, handleChange, setFieldValue, values, isSubmitting } =
		formik;

	console.log({
		pctx,
		values,
		getPreselectedChildren: getPreselectedChildren(values.pagesFilter),
	});
	return (
		<form onSubmit={handleSubmit}>
			<Flex
				alignItems="center"
				justifyContent="center"
				overflow="visible"
				m={5}
			>
				<Paper
					bg="paper"
					maxWidth={600}
					minWidth={['initial', 500]}
					overflow="visible"
				>
					<Box>
						<Flex width={1} justifyContent="space-between" alignItems="center">
							<H1 my={3}>Exportovat publikaci</H1>
							<IconButton color="primary" onClick={closeModal}>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						<Text fontSize="sm">
							Název publikace: <b>{pubTitle}</b>
						</Text>
						<Text fontSize="sm">
							ID publikace: <b>{pubId}</b>
						</Text>
						<Text fontSize="sm">
							Obohacená: <b>{enriched ? 'Áno' : 'Ne'}</b>
						</Text>

						<Text my={2} mt={4}>
							{t('exports:dialog.export_name')}
						</Text>
						<TextInput
							id="exportName"
							mb={2}
							label=""
							labelType="inline"
							value={values.exportName}
							onChange={handleChange}
							placeholder={pubTitle}
							width={1}
							bg="white"
						/>

						<Text my={2} mt={4}>
							{t('exports:dialog.format')}
						</Text>
						<SimpleSelect
							formikId="format"
							mb={2}
							options={formatOptions}
							nameFromOption={item => item?.label ?? 'unknown'}
							keyFromOption={item => item?.id ?? 'unknown'}
							value={values.format}
							setFieldValue={setFieldValue}
							variant="outlined"
							width={1}
							bg="white"
						/>

						{values.format.id !== 'text' && values.format.id !== 'alto' && (
							<>
								<Divider my={3} />
								<Text fontSize="xl" my={3} fontWeight="bold">
									{t('exports:dialog.parameters')}
								</Text>
							</>
						)}

						{values.format.id === 'csv' && (
							<Flex
								mb={3}
								alignItems="center"
								justifyContent="space-between"
								mr={2}
							>
								<Text my={2}>{t('exports:dialog.delimiter')}</Text>
								<RadioButton
									//mr={5}
									label={t('exports:dialog.comma')}
									name="divider-radio-grp"
									id="radio-comma"
									checked={values.delimiter === delimiterEnum.comma}
									onChange={() => {
										setFieldValue('delimiter', delimiterEnum.comma);
									}}
								/>
								<RadioButton
									label={t('exports:dialog.tab')}
									name="divider-radio-grp"
									id="radio-tab"
									checked={values.delimiter === delimiterEnum.tab}
									onChange={() => {
										setFieldValue('delimiter', delimiterEnum.tab);
									}}
								/>
							</Flex>
						)}
						{values.format.id !== 'text' &&
							values.format.id !== 'alto' &&
							values.format.id !== 'tei' && (
								<>
									<Text my={2}>{t('exports:dialog.include_fields')}</Text>
									<SelectInput
										key="includeFields"
										id="includeFields"
										placeholder={t('exports:dialog.choose_field')}
										options={exportFieldOptions}
										nameFromOption={item => item?.label ?? ''}
										labelFromOption={item => item?.label ?? ''}
										keyFromOption={item => item?.id ?? ''}
										value={values.includeFields}
										onSetValue={setFieldValue}
										multiselect
										disabled={values.excludeFields.length > 0 || isSubmitting}
									/>

									<Text my={2} mt={4}>
										{t('exports:dialog.exclude_fields')}
									</Text>
									<SelectInput
										key="excludeFields"
										id="excludeFields"
										placeholder={t('exports:dialog.choose_field')}
										options={exportFieldOptions}
										nameFromOption={item => item?.label ?? ''}
										labelFromOption={item => item?.label ?? ''}
										keyFromOption={item => item?.id ?? ''}
										value={values.excludeFields}
										onSetValue={setFieldValue}
										multiselect
										disabled={values.includeFields.length > 0 || isSubmitting}
									/>
								</>
							)}
						{values.format.id === 'tei' && (
							<>
								<Text fontSize="lg" my={3} fontWeight="bold">
									{t('exports:dialog.limit_enrichment_parameters')}
								</Text>
								<Text my={2}>{t('exports:dialog.altoParams')}</Text>
								<SelectInput
									key="altoParams"
									id="altoParams"
									placeholder={t('exports:dialog.choose_field')}
									options={altoParamsOptions}
									value={values.altoParams ?? []}
									onSetValue={setFieldValue}
									multiselect
								/>

								<Text my={2} mt={4}>
									{t('exports:dialog.nameTagParams')}
								</Text>
								<SelectInput
									key="nameTagParams"
									id="nameTagParams"
									placeholder={t('exports:dialog.choose_field')}
									options={nameTagParamsExportOptions}
									value={values.nameTagParams ?? []}
									onSetValue={setFieldValue}
									multiselect
									labelFromOption={labelFromOption}
									keyFromOption={item => item?.id ?? ''}
									searchKeys={['label', 'labelCode']}
								/>
								<Text my={2} mt={4}>
									{t('exports:dialog.udPipeParams')}
								</Text>
								<SelectInput
									key="udPipeParams"
									id="udPipeParams"
									placeholder={t('exports:dialog.choose_field')}
									options={udPipeParamsOptions}
									value={values.udPipeParams ?? []}
									onSetValue={setFieldValue}
									multiselect
								/>
							</>
						)}
						{/* <Box mt={4}>
							<Checkbox
								id="exportAll"
								label="Exportovat celé publikace"
								checked={values.exportAll}
								onChange={handleChange}
							/>
						</Box> */}
						<Divider my={3} />
						<Flex my={3} justifyContent="space-between" alignItems="center">
							<Flex>
								<Button
									variant="primary"
									type="submit"
									loading={isSubmitting}
									disabled={isSubmitting}
								>
									{t('exports:dialog.finish_export_button')}
								</Button>
								<Button variant="outlined" ml={3} onClick={closeModal}>
									{t('exports:dialog.cancel')}
								</Button>
							</Flex>
							<Flex alignItems="center">
								<MdInfo size={20} />
								<Text ml={2}>
									{getPreselectedChildren(values.pagesFilter).length}{' '}
									{t('exports:dialog.publications_count')} |
								</Text>

								<EditSelectedChildren
									preSelected={getPreselectedChildren(values.pagesFilter)}
									disabled={
										values.format.id !== 'json' &&
										values.format.id !== 'csv' &&
										values.format.id !== 'alto' &&
										values.format.id !== 'text'
									}
									onEdit={selected => {
										setFieldValue('pagesFilter', selected);
									}}
								/>
							</Flex>
						</Flex>
					</Box>
				</Paper>
			</Flex>
		</form>
	);
};

const PublicationExportDialog = () => {
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<IconButton
					color="primary"
					onClick={openModal}
					tooltip="Exportovat publikaci"
				>
					<MdDownload size={24} />
				</IconButton>
			)}
		>
			{closeModal => <ExportForm closeModal={closeModal} />}
		</ModalDialog>
	);
};

export default PublicationExportDialog;
