import { useFormik } from 'formik';
import { FC } from 'react';
import { MdClose, MdDownload, MdImportExport, MdInfo } from 'react-icons/md';
import { useKeycloak } from '@react-keycloak/web';

import Checkbox from 'components/form/checkbox/Checkbox';
import SimpleSelect from 'components/form/select/SimpleSelect';
import ModalDialog from 'components/modal';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';

import { api } from 'api';

import { usePublicationDetail } from 'api/publicationsApi';

import { PUBLICATION_EXPORT_STORE_KEY } from 'utils/enumsMap';
import Store from 'utils/Store';

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
	};
};

const formatOptions: FormatOption[] = [
	{ label: 'TEXT', id: 'text' },
	{ label: 'TEI', id: 'tei' },
	{ label: 'JSON', id: 'json' },
	{ label: 'CSV', id: 'csv' },
	{ label: 'ALTO', id: 'alto' },
];

const attributesOptions: AtributeOption[] = [];
[
	{ label: 'Atribút 1', id: 'att1' },
	{ label: 'Atribút 2', id: 'att2' },
	{ label: 'Atribút 3', id: 'att3' },
	{ label: 'Atribút 4', id: 'att4' },
];

type ExportFormType = {
	format: FormatOption;
	attributes: AtributeOption;
	exportAll: boolean;
};

const ExportForm: FC<{ closeModal: () => void }> = ({ closeModal }) => {
	//const pubId2 = 'uuid:2cc15a70-a7e4-11e6-b707-005056827e51';
	const pubId = Store.get<string>(PUBLICATION_EXPORT_STORE_KEY) ?? '';
	const { keycloak } = useKeycloak();

	console.log({ keycloak });

	const pubDetail = usePublicationDetail(pubId);

	const formik = useFormik<ExportFormType>({
		initialValues: {
			format: formatOptions[0],
			attributes: attributesOptions[0],
			exportAll: false,
		},

		onSubmit: async values => {
			console.log({ values });
			const params: Partial<Params> = {
				params: {
					excludeFields: [],
					filters: [],
					includeFields: [],
					sorting: [],
				},
			};

			try {
				const response = await api().post(
					`exports/generate/${pubId}/${values.format.id}`,
					{ json: params },
				);

				console.log({ response });

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
							<H1 my={3}>Exportovat výběr publikací</H1>
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
						<Text my={2} mt={4}>
							Formát
						</Text>
						<SimpleSelect
							formikId="format"
							mb={3}
							options={formatOptions}
							nameFromOption={item => item?.label ?? 'unknown'}
							keyFromOption={item => item?.id ?? 'unknown'}
							value={values.format}
							setFieldValue={setFieldValue}
							variant="outlined"
							width={1}
							bg="white"
						/>
						<Text my={2} mt={4}>
							Atributy
						</Text>
						<SimpleSelect
							formikId="attributes"
							mb={3}
							options={attributesOptions}
							nameFromOption={item => item?.label ?? 'unknown'}
							keyFromOption={item => item?.id ?? 'unknown'}
							value={values.attributes}
							setFieldValue={setFieldValue}
							variant="outlined"
							width={1}
							bg="white"
						/>
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

const PublicationExportDialog = () => {
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<IconButton color="primary" onClick={openModal}>
					<MdDownload size={24} />
				</IconButton>
			)}
		>
			{closeModal => <ExportForm closeModal={closeModal} />}
		</ModalDialog>
	);
};

export default PublicationExportDialog;
