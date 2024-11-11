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
import { pluralRules } from 'utils';
import {
	Delimiter,
	AltoParam,
	PipeParam,
	ExportFilter,
	TagParam,
	ExportFilterEQ,
	NameTagExportOption,
} from 'models/exports';
import { LabeledObject } from 'models/common';
import { PagableSort } from 'models/solr';

import {
	altoParamsOptions,
	exportFieldOptions,
	udPipeParamsOptions,
	useNameTagParamExportOptions,
} from './exportUtils';

export type ExportFormType = {
	format: LabeledObject;
	includeFields: LabeledObject[];
	excludeFields: LabeledObject[];
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

		sorting?: PagableSort[];
		filters?: ExportFilter[];
		includeFields?: string[];
		excludeFields?: string[];
		delimiter?: Delimiter;
	};
	teiParams?: {
		udPipeParams?: PipeParam[];
		altoParams?: AltoParam[];
		nameTagParams?: TagParam[];
	};
	jobType: string;
};

export type ExportParamsDto = {
	name: string;
	config: ExportParasConfig;
	publicationIds: string[];
};

export enum delimiterEnum {
	comma = ',',
	tab = '\t',
}

export const commonFormatOptions: LabeledObject[] = [
	{ label: 'TEXT', id: 'text' },
	{ label: 'ALTO', id: 'alto' },
];

export const enrichedFormatOptions: LabeledObject[] = [
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
			teiParams: {
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
	const formatOptions: LabeledObject[] = enriched
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
			altoParams: [...altoParamsOptions],
			nameTagParams: [...nameTagParamsExportOptions],
			udPipeParams: [...udPipeParamsOptions],
		},

		onSubmit: async values => {
			const config = formatValues(values);
			const exportName = values.exportName.trim();
			const json: ExportParamsDto = {
				name: exportName,
				config,
				publicationIds: [pubId],
			};

			try {
				const response = await api().post(`exports/generate`, { json });

				if (response.status === 200) {
					toast.info(t('exports:export_create_success'), { autoClose: 10000 });
					closeModal();
				} else {
					toast.error(
						`${t('exports:export_create_error')} \n ${response.status}`,
					);
				}

				closeModal();
			} catch (error) {
				toast.error(`${t('exports:export_create_error')} \n ${error}`);
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
							<H1 my={3}>{t('exports:dialog:export_publication')}</H1>
							<IconButton color="primary" onClick={closeModal}>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						<Text>{t('exports:export_dialog_login_request')}</Text>
						<Button
							variant="primary"
							onClick={() => {
								keycloak.login();
							}}
						>
							{t('navbar:login')}
						</Button>
					</Box>
				</Paper>
			</Flex>
		);
	}

	const { handleSubmit, handleChange, setFieldValue, values, isSubmitting } =
		formik;

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
							<H1 my={3}>{t('exports:dialog:export_publication')}</H1>
							<IconButton color="primary" onClick={closeModal}>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						<Text fontSize="sm">
							{t('exports:dialog:pub_title')}: <b>{pubTitle}</b>
						</Text>
						<Text fontSize="sm">
							{t('exports:dialog:pub_id')}: <b>{pubId}</b>
						</Text>
						<Text fontSize="sm">
							{t('search:enrichment:is_enriched')}:{' '}
							<b>{enriched ? t('common:yes') : t('common:no')}</b>
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
									{t(
										`common:n_pages:${pluralRules(
											getPreselectedChildren(values.pagesFilter).length,
										)}`,
									)}{' '}
									|
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
	const { t } = useTranslation();
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<IconButton
					color="primary"
					onClick={openModal}
					tooltip={t('exports:dialog:export_publication')}
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
