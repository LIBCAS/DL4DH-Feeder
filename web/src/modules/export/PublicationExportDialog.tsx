import { useFormik } from 'formik';
import { FC, useContext } from 'react';
import { MdClose, MdDownload, MdInfo } from 'react-icons/md';
import { useKeycloak } from '@react-keycloak/web';
import { useParams } from 'react-router-dom';

import Checkbox from 'components/form/checkbox/Checkbox';
import SimpleSelect from 'components/form/select/SimpleSelect';
import ModalDialog from 'components/modal';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';
import RadioButton from 'components/styled/RadioButton';
import SelectInput from 'components/form/select/SelectInput';

import { PubCtx } from 'modules/publication/ctx/pub-ctx';

import { api } from 'api';

import { fieldOptions } from './exportModels';

type FormatOption = { label: string; id: string };
type AtributeOption = { label: string; id: string };

export type Sort = {
	field: string;
	direction: 'ASC' | 'DESC';
};

export type Filter = {
	id: string;
	field: string;
	operation: 'EQ';
	value: string;
};

type ExportFormType = {
	format: FormatOption;
	includeFields: AtributeOption[];
	excludeFields: AtributeOption[];
	delimiter: delimiterEnum;
	exportAll: boolean;
	isSecond?: boolean;
};

type Params = {
	params: {
		disablePagination?: boolean;
		paging?: {
			pageOffset?: number;
			pageSize?: number;
		};

		sorting?: Sort[];
		filters?: Filter[];
		includeFields?: string[];
		excludeFields?: string[];
		delimiter: delimiterEnum;
	};
};

enum delimiterEnum {
	comma = ',',
	tab = '\t',
}

const formatOptions: FormatOption[] = [
	{ label: 'JSON', id: 'json' },
	{ label: 'TEXT', id: 'text' },
	{ label: 'TEI', id: 'tei' },
	{ label: 'CSV', id: 'csv' },
	{ label: 'ALTO', id: 'alto' },
];

const ExportForm: FC<{ closeModal: () => void; isSecond?: boolean }> = ({
	closeModal,
	isSecond,
}) => {
	const { keycloak } = useKeycloak();

	const { id: paramId } = useParams<{ id: string }>();

	const pubCtx = useContext(PubCtx);
	const pubId = isSecond
		? pubCtx.secondPublication?.pid ?? 'ctx-right-pid-export-error'
		: pubCtx.publication?.pid ?? paramId ?? 'ctx-left-pid-export-error';

	const formik = useFormik<ExportFormType>({
		initialValues: {
			format: formatOptions[0],
			includeFields: [],
			excludeFields: [],
			exportAll: false,
			delimiter: delimiterEnum.comma,
		},

		onSubmit: async values => {
			console.log({ values });
			const params: Partial<Params> = {
				params: {
					excludeFields: values.excludeFields.map(f => f.id),
					filters: [],
					includeFields: values.includeFields.map(f => f.id),
					sorting: [],
					delimiter: values.delimiter,
				},
			};

			try {
				const response = await api().post(
					`exports/generate/${pubId}/${values.format.id}`,
					{ json: params },
				);

				closeModal();
			} catch (error) {
				console.log({ error });
			}
			closeModal();
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

	const { handleSubmit, handleChange, setFieldValue, values } = formik;

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
							ID publikace: <b>{pubId}</b>
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

						<Text fontSize="xl" mt={3}>
							Parametry
						</Text>
						<Divider my={3} />
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
						{values.format.id !== 'text' && values.format.id !== 'alto' && (
							<>
								<Text my={2}>Zahrnout pole</Text>
								<SelectInput
									key="includeFields"
									id="includeFields"
									placeholder="Zvolte pole"
									options={fieldOptions}
									nameFromOption={item => item?.label ?? ''}
									labelFromOption={item => item?.label ?? ''}
									keyFromOption={item => item?.id ?? ''}
									value={values.includeFields}
									onSetValue={setFieldValue}
									multiselect
									hideInlineSelectItems
								/>
								{/* <SimpleSelect
									formikId="includeFields"
									mb={3}
									options={fieldOptions}
									nameFromOption={item => item?.label ?? 'unknown'}
									keyFromOption={item => item?.id ?? 'unknown'}
									value={values.includeFields[0]}
									setFieldValue={setFieldValue}
									variant="outlined"
									width={1}
									bg="white"
								/> */}
								<Text my={2} mt={4}>
									Nezahrnout pole
								</Text>
								{/* <SimpleSelect
									formikId="excludeFields"
									mb={3}
									options={fieldOptions}
									nameFromOption={item => item?.label ?? 'unknown'}
									keyFromOption={item => item?.id ?? 'unknown'}
									value={values.excludeFields}
									setFieldValue={setFieldValue}
									variant="outlined"
									width={1}
									bg="white"
								/> */}
								<SelectInput
									key="excludeFields"
									id="excludeFields"
									placeholder="Zvolte pole"
									options={fieldOptions}
									nameFromOption={item => item?.label ?? ''}
									labelFromOption={item => item?.label ?? ''}
									keyFromOption={item => item?.id ?? ''}
									value={values.excludeFields}
									onSetValue={setFieldValue}
									multiselect
									hideInlineSelectItems
								/>
							</>
						)}
						<Box mt={4}>
							<Checkbox
								id="exportAll"
								label="Exportovat celé publikace"
								checked={values.exportAll}
								onChange={handleChange}
							/>
						</Box>
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
								<Text ml={2}>? Stránek</Text>
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
				<IconButton color="primary" onClick={openModal}>
					<MdDownload size={24} />
				</IconButton>
			)}
		>
			{closeModal => <ExportForm closeModal={closeModal} isSecond={isSecond} />}
		</ModalDialog>
	);
};

export default PublicationExportDialog;
