import { useKeycloak } from '@react-keycloak/web';
import { useFormik } from 'formik';
import { FC } from 'react';
import { MdClose, MdDownload, MdInfo } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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

import { usePublicationContext } from 'modules/publication/ctx/pub-ctx';

import { api } from 'api';

import {
	AltoParam,
	altoParamsOptions,
	Delimiter,
	ExportFieldOption,
	exportFieldOptions,
	ExportFilter,
	ExportFormatOption,
	ExportSort,
	nameTagParamsOptions,
	PipeParam,
	TagParam,
	udPipeParamsOptions,
} from './exportModels';

type ExportFormType = {
	format: ExportFormatOption;
	includeFields: ExportFieldOption[];
	excludeFields: ExportFieldOption[];
	delimiter: Delimiter;
	exportAll: boolean;
	isSecond?: boolean;
	altoParams?: AltoParam[];
	nameTagParams?: TagParam[];
	udPipeParams?: PipeParam[];
};

type ExportParamsDto = {
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
};

enum delimiterEnum {
	comma = ',',
	tab = '\t',
}

const commonFormatOptions: ExportFormatOption[] = [
	{ label: 'TEXT', id: 'text' },
	{ label: 'ALTO', id: 'alto' },
];

const enrichedFormatOptions: ExportFormatOption[] = [
	{ label: 'JSON', id: 'json' },
	{ label: 'TEXT', id: 'text' },
	{ label: 'TEI', id: 'tei' },
	{ label: 'CSV', id: 'csv' },
	{ label: 'ALTO', id: 'alto' },
];

type Props = {
	closeModal: () => void;
	isSecond?: boolean;
};

const formatValues = (values: ExportFormType): ExportParamsDto => {
	const common = { sorting: [], filters: [] };
	const format = values.format.id;
	if (format === 'alto' || format === 'text') {
		return { params: { ...common } };
	}
	if (format === 'json') {
		return {
			params: {
				...common,
				includeFields: values.includeFields.map(f => f.id),
				excludeFields: values.excludeFields.map(f => f.id),
			},
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
		};
	}

	if (format === 'tei') {
		return {
			params: {
				...common,
			},
			teiExportParams: {
				altoParams: values.altoParams,
				nameTagParams: values.nameTagParams,
				udPipeParams: values.udPipeParams,
			},
		};
	}

	return { params: { ...common } };
};

export const ExportForm: FC<Props> = ({ closeModal, isSecond }) => {
	const { keycloak } = useKeycloak();

	const { id: paramId } = useParams<{ id: string }>();

	const pubCtx = usePublicationContext();
	const pubId = isSecond
		? pubCtx.secondPublication?.pid ?? 'ctx-right-pid-export-error'
		: pubCtx.publication?.pid ?? paramId ?? 'ctx-left-pid-export-error';
	const pubTitle = isSecond
		? pubCtx.secondPublication?.title ?? 'ctx-right-pid-export-error'
		: pubCtx.publication?.title ?? paramId ?? 'ctx-left-pid-export-error';

	const enriched = isSecond
		? pubCtx.secondPublication?.enriched
		: pubCtx.publication?.enriched;

	const formatOptions: ExportFormatOption[] = enriched
		? enrichedFormatOptions
		: commonFormatOptions;

	const formik = useFormik<ExportFormType>({
		initialValues: {
			format: formatOptions[0],
			includeFields: [],
			excludeFields: [],
			exportAll: false,
			delimiter: delimiterEnum.comma,
		},

		onSubmit: async values => {
			const params = formatValues(values);

			try {
				const response = await api().post(
					`exports/generate/${pubId}/${values.format.id}`,
					{ json: params },
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

	const {
		handleSubmit,
		/* handleChange ,*/ setFieldValue,
		values,
		isSubmitting,
	} = formik;

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
							Formát
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
								<Text fontSize="xl" mt={3}>
									Parametry
								</Text>
								<Divider my={3} />
							</>
						)}

						{values.format.id === 'csv' && (
							<Flex
								mb={3}
								alignItems="center"
								justifyContent="space-between"
								mr={2}
							>
								<Text my={2}>Rozdělovač</Text>
								<RadioButton
									//mr={5}
									label="Čárka"
									name="divider-radio-grp"
									id="radio-comma"
									checked={values.delimiter === delimiterEnum.comma}
									onChange={() => {
										setFieldValue('delimiter', delimiterEnum.comma);
									}}
								/>
								<RadioButton
									label="Tabulátor"
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
									<Text my={2}>Zahrnout pole</Text>
									<SelectInput
										key="includeFields"
										id="includeFields"
										placeholder="Zvolte pole"
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
										Nezahrnout pole
									</Text>

									<SelectInput
										key="excludeFields"
										id="excludeFields"
										placeholder="Zvolte pole"
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
								<Text my={2}>Alto Params</Text>
								<SelectInput
									key="altoParams"
									id="altoParams"
									placeholder="Zvolte pole"
									options={altoParamsOptions}
									value={values.altoParams ?? []}
									onSetValue={setFieldValue}
									multiselect
								/>

								<Text my={2} mt={4}>
									NameTag Params
								</Text>
								<SelectInput
									key="nameTagParams"
									id="nameTagParams"
									placeholder="Zvolte pole"
									options={nameTagParamsOptions}
									value={values.nameTagParams ?? []}
									onSetValue={setFieldValue}
									multiselect
								/>
								<Text my={2} mt={4}>
									udPipe Params
								</Text>
								<SelectInput
									key="udPipeParams"
									id="udPipeParams"
									placeholder="Zvolte pole"
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
								<Button variant="primary" type="submit">
									Exportovat
								</Button>
								<Button variant="outlined" ml={3} onClick={closeModal}>
									Zrušit
								</Button>
							</Flex>
							<Flex alignItems="center">
								<MdInfo size={20} />
								<Text ml={2}>
									{isSecond
										? pubCtx.publicationChildrenOfSecond?.length ?? '?'
										: pubCtx.publicationChildren?.length ?? '?'}{' '}
									Stránek
								</Text>
							</Flex>
						</Flex>
					</Box>
				</Paper>
			</Flex>
		</form>
	);
};

const PublicationExportDialog: FC<{ isSecond?: boolean }> = ({ isSecond }) => {
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
			{closeModal => <ExportForm closeModal={closeModal} isSecond={isSecond} />}
		</ModalDialog>
	);
};

export default PublicationExportDialog;
