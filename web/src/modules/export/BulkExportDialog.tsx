/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useKeycloak } from '@react-keycloak/web';
import { useFormik } from 'formik';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose, MdInfo } from 'react-icons/md';
import { toast } from 'react-toastify';

import TextInput from 'components/form/input/TextInput';
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
import { EditSelectedPublications } from 'components/tiles/TilesWithCheckbox';

import { Loader } from 'modules/loader';

import { api } from 'api';
import { LabeledObject } from 'models/common';

import { useBulkExportContext } from 'hooks/useBulkExport';

import {
	altoParamsOptions,
	exportFieldOptions,
	udPipeParamsOptions,
	useNameTagParamExportOptions,
	generateExportName,
	useCheckAltoStreams,
	useExportIncludeExcludeOptionsLabel,
} from './exportUtils';
import {
	commonFormatOptions,
	delimiterEnum,
	enrichedFormatOptions,
	ExportFormType,
	ExportParamsDto,
	formatValues,
} from './PublicationExportDialog';

type Props = {
	closeModal: () => void;
};

export const ExportForm: FC<Props> = ({ closeModal }) => {
	const { keycloak } = useKeycloak();

	const generatedName = useMemo(() => generateExportName(), []);
	const { t } = useTranslation();
	const [allEnriched, setAllEnriched] = useState<boolean>(false);
	const [checkAltoStream, setCheckAltoStream] = useState<boolean>(false);
	const { labelFromOption, nameTagParamsExportOptions } =
		useNameTagParamExportOptions();

	const includeExcludeOptionsLabel = useExportIncludeExcludeOptionsLabel();

	const exportCtx = useBulkExportContext();

	const publicationIds = useMemo(
		() =>
			Object.keys(exportCtx.uuidHeap).filter(
				k => exportCtx.uuidHeap[k].selected,
			) ?? [],
		[exportCtx],
	);

	const {
		result: altoResult,
		isLoading: altoCheckLoading,
		progress,
	} = useCheckAltoStreams(checkAltoStream);

	useEffect(() => {
		setAllEnriched(
			Object.keys(exportCtx.uuidHeap).length > 0 &&
				!Object.keys(exportCtx.uuidHeap)
					.filter(key => exportCtx.uuidHeap[key].selected)
					.some(uuid => !exportCtx.uuidHeap[uuid].enriched),
		);
	}, [exportCtx.uuidHeap]);

	const formatOptions: LabeledObject[] = allEnriched
		? enrichedFormatOptions
		: commonFormatOptions;

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
			let exportName = generatedName;
			const json: ExportParamsDto = {
				name: exportName,
				config,
				publicationIds,
			};
			if (values.exportName.trim() !== '') {
				exportName = values.exportName.trim();
			}

			try {
				const response = await api().post(`exports/generate`, { json });

				if (response.status === 200) {
					toast.info(t('exports:form_response.success'), { autoClose: 10000 });
					closeModal();
				} else {
					toast.error(
						`${t('exports:form_response.error')} \n ${response.status}`,
					);
				}

				closeModal();
			} catch (error) {
				toast.error(`${t('exports:form_response.error')} \n ${error}`);
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
					<Box mb={3}>
						<Flex width={1} justifyContent="space-between" alignItems="center">
							<H1 my={3}>{t('exports:export_dialog_title')}</H1>
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

	if (Object.keys(exportCtx.uuidHeap).length < 1) {
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
							<H1 my={3}>{t('exports:export_dialog_title')}</H1>
							<IconButton color="primary" onClick={closeModal}>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						<Text>{t('exports:export_dialog_select_request')}</Text>
					</Box>
				</Paper>
			</Flex>
		);
	}

	const { handleSubmit, setFieldValue, values, isSubmitting, handleChange } =
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
					position="relative"
				>
					{altoCheckLoading && (
						<Flex
							opacity={0.6}
							alignItems="center"
							justifyContent="center"
							bg="white"
							zIndex={2}
							css={css`
								position: absolute;
								width: 100%;
								height: 100%;
								top: 0;
								left: 0;
							`}
						>
							<Box>
								<H1>
									{progress.msg} ... {progress.current} / {progress.total}
								</H1>
								<Loader />
							</Box>
						</Flex>
					)}
					<Box>
						<Flex width={1} justifyContent="space-between" alignItems="center">
							<H1 my={3}>{t('exports:export_dialog_title')}</H1>
							<IconButton
								color="primary"
								onClick={closeModal}
								css={css`
									z-index: 3;
								`}
							>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						<Text fontSize="sm">
							{t('exports:dialog.all_enriched')}:{' '}
							<b>{allEnriched ? t('common:yes') : t('common:no')}</b>
						</Text>

						<Text fontSize="sm">
							{t('exports:dialog.all_alto_available')}:{' '}
							{checkAltoStream ? (
								<b>
									{altoResult.allHaveAlto ? t('common:yes') : t('common:no')}
								</b>
							) : (
								<Button
									variant="text"
									fontSize="md"
									px={1}
									onClick={() => setCheckAltoStream(true)}
								>
									{t('common:check')}
								</Button>
							)}
						</Text>

						{altoResult.uuidsWithoutAlto.length > 0 ? (
							<SimpleSelect
								options={altoResult.uuidsWithoutAlto}
								value={null}
								onChange={() => null}
								placeholder={t('exports:dialog.no_alto')}
								nameFromOption={item =>
									item ? exportCtx.uuidHeap[item]?.title ?? item : '---'
								}
								menuWrapperCss={css`
									max-height: 400px;
									overflow-y: auto;
								`}
							/>
						) : (
							<Divider my={2} />
						)}

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
							placeholder={generatedName}
							width={1}
							bg="white"
						/>

						<Text my={2} mt={4}>
							{t('exports:dialog.format')}
						</Text>
						<SimpleSelect
							formikId="format"
							mb={2}
							options={
								altoResult.allHaveAlto
									? formatOptions
									: formatOptions.filter(fo => fo.id !== 'alto')
							}
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
										labelFromOption={item =>
											includeExcludeOptionsLabel(item?.id as string)
										}
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
										labelFromOption={item =>
											includeExcludeOptionsLabel(item?.id as string)
										}
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
									labelFromOption={labelFromOption}
									searchKeys={['label', 'labelCode']}
									multiselect
									keyFromOption={item => item?.id ?? ''}
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
									disabled={isSubmitting || publicationIds.length < 1}
									loading={isSubmitting}
								>
									{t('exports:dialog.finish_export_button')}
								</Button>
								<Button
									variant="outlined"
									ml={3}
									onClick={closeModal}
									css={css`
										z-index: 3;
									`}
								>
									{t('exports:dialog.cancel')}
								</Button>
							</Flex>
							<Flex alignItems="center">
								<MdInfo size={20} />
								<Text ml={2}>
									{publicationIds.length}{' '}
									{t('exports:dialog.publications_count')} |{' '}
								</Text>
								<EditSelectedPublications
									onEdit={() => {
										if (
											!allEnriched &&
											!commonFormatOptions.find(
												op => op.id === values.format.id,
											)
										) {
											setFieldValue('format', commonFormatOptions[0]);
										}
									}}
									preSelected={[]}
									disabled={altoCheckLoading}
								/>
							</Flex>
						</Flex>
					</Box>
				</Paper>
			</Flex>
		</form>
	);
};

export const BulkExportModeSwitch: FC = () => {
	const { setExportModeOn, exportModeOn } = useBulkExportContext();
	const { t } = useTranslation('exports');
	return (
		<Button
			onClick={() => setExportModeOn?.(p => !p)}
			variant="primary"
			backgroundColor={exportModeOn ? 'enriched' : 'primary'}
			color={exportModeOn ? 'textH4' : 'white'}
			px={2}
			tooltip={t('export_mode_switch_tooltip')}
		>
			{exportModeOn ? (
				<>
					<Flex mr={1}>
						<MdClose />
					</Flex>
					{t('export_mode_switch_off')}
				</>
			) : (
				t('export_mode_switch_on')
			)}
		</Button>
	);
};

const BulkExportDialog: FC = () => {
	const { t } = useTranslation('exports');
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button
					px={2}
					minWidth={60}
					variant="primary"
					onClick={openModal}
					tooltip={t('export_dialog_button')}
				>
					{t('export_dialog_button')}
				</Button>
			)}
		>
			{closeModal => <ExportForm closeModal={closeModal} />}
		</ModalDialog>
	);
};

export default BulkExportDialog;
