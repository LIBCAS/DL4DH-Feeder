import { useKeycloak } from '@react-keycloak/web';
import { useFormik } from 'formik';
import { FC, useMemo } from 'react';
import { MdClose, MdInfo } from 'react-icons/md';
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
import { EditSelectedPublications } from 'components/tiles/TilesWithCheckbox';
import TextInput from 'components/form/input/TextInput';

import { api } from 'api';

import { useBulkExportContext } from 'hooks/useBulkExport';

import {
	altoParamsOptions,
	exportFieldOptions,
	ExportFormatOption,
	nameTagParamsOptions,
	udPipeParamsOptions,
} from './exportModels';
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

const generateExportName = () => {
	const formatNumber = (x: number): string => (x < 10 ? `0${x}` : x.toString());
	const date = new Date();
	const yy = formatNumber(date.getFullYear());
	const mm = formatNumber(date.getMonth());
	const dd = formatNumber(date.getDay());
	const hh = formatNumber(date.getHours());
	const mins = formatNumber(date.getMinutes());
	const ss = formatNumber(date.getSeconds());
	return `export-${yy}${mm}${dd}-${hh}${mins}${ss}`;
};

export const ExportForm: FC<Props> = ({ closeModal }) => {
	const { keycloak } = useKeycloak();

	const generatedName = useMemo(() => generateExportName(), []);

	const exportCtx = useBulkExportContext();
	const publicationIds = useMemo(
		() =>
			Object.keys(exportCtx.uuidHeap).filter(
				k => exportCtx.uuidHeap[k].selected,
			) ?? [],
		[exportCtx],
	);

	const enriched =
		Object.keys(exportCtx.uuidHeap).length > 0 &&
		!Object.keys(exportCtx.uuidHeap).some(
			uuid => !exportCtx.uuidHeap[uuid].publication.enriched,
		);

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
			pagesFilter: [],
			exportName: '',
		},

		onSubmit: async values => {
			const config = formatValues(values);
			const json: ExportParamsDto = {
				config,
				publicationIds,
			};
			let exportName = generatedName;
			if (values.exportName.trim() !== '') {
				exportName = values.exportName.trim();
			}

			try {
				const response = await api().post(
					`exports/generate/${values.format.id}?name=${exportName}`,
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
							<H1 my={3}>Exportovat publikace</H1>
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
							<H1 my={3}>Exportovat publikace</H1>
							<IconButton color="primary" onClick={closeModal}>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						<Text>Pro export je nutné vybrat aspoň jednu publikaci</Text>
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
				>
					<Box>
						<Flex width={1} justifyContent="space-between" alignItems="center">
							<H1 my={3}>Exportovat publikace</H1>
							<IconButton color="primary" onClick={closeModal}>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						{/**TODO: */}
						{/* <Text fontSize="sm">
							Název publikace: <b>{pubTitle}</b>
						</Text>
						<Text fontSize="sm">
							ID publikace: <b>{pubId}</b>
						</Text> */}
						<Text fontSize="sm">
							Všechny obohacené: <b>{enriched ? 'Áno' : 'Ne'}</b>
						</Text>

						<Divider my={2} />

						<Text my={2} mt={4}>
							Název exportu
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
								<Button
									variant="primary"
									type="submit"
									disabled={isSubmitting || publicationIds.length < 1}
									loading={isSubmitting}
								>
									Exportovat
								</Button>
								<Button variant="outlined" ml={3} onClick={closeModal}>
									Zrušit
								</Button>
							</Flex>
							<Flex alignItems="center">
								<MdInfo size={20} />
								<Text ml={2}>{publicationIds.length} publikací | </Text>
								<EditSelectedPublications
									onEdit={() => null}
									preSelected={[]}
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
			px={0}
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
