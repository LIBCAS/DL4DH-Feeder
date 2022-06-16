import { FC } from 'react';
import { MdClose, MdInfo } from 'react-icons/md';
import { useFormik } from 'formik';

import ModalDialog from 'components/modal';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import SimpleSelect from 'components/form/select/SimpleSelect';
import Text, { H1 } from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import Divider from 'components/styled/Divider';
import Checkbox from 'components/form/checkbox/Checkbox';

import { api } from 'api';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

import Store from 'utils/Store';
import { PUBLICATION_EXPORT_STORE_KEY } from 'utils/enumsMap';

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
	disablePagination?: boolean;
	pageOffset?: number;
	pageSize?: number;
	sort?: Sort;
	filters?: Filter[];
	includeFields?: string[];
	excludeFields?: string[];
};

const formatOptions: FormatOption[] = [
	{ label: 'TEXT', id: 'text' },
	{ label: 'TEI', id: 'tei' },
	{ label: 'JSON', id: 'json' },
	{ label: 'CSV', id: 'csv' },
	{ label: 'ALTO', id: 'alto' },
];

const attributesOptions: AtributeOption[] = [
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

	const pubDetail = usePublicationDetail(pubId);

	console.log({ pub: pubDetail.data });

	const formik = useFormik<ExportFormType>({
		initialValues: {
			format: formatOptions[0],
			attributes: attributesOptions[0],
			exportAll: false,
		},

		onSubmit: async values => {
			console.log({ values });
			const params = {
				//includeFields: ['author'],
				sort: [{ field: 'index', direction: 'ASC' }],
			};

			try {
				const response = await api().post(
					`exports/${pubId}/${values.format.id}`,
					{ json: params },
				);
				/* const response = await fetch(
					`https://dl4dh.inqool.cz/api/exports/${pubId}/${values.format.id}`,
					{
						method: 'POST',
						headers: new Headers({ 'Content-Type': 'application/json' }),
						body: JSON.stringify(params),
					},
				);
 				*/
				console.log({ response });

				closeModal();
			} catch (error) {
				console.log({ error });
			}
			closeModal();
		},
	});

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
							<H1 my={3}>Exportovat výběr publikací</H1>
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

const ListExportDialog = () => {
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button height={30} ml={3} variant="primary" onClick={openModal} p={1}>
					Exportovat
				</Button>
			)}
		>
			{closeModal => <ExportForm closeModal={closeModal} />}
		</ModalDialog>
	);
};

export default ListExportDialog;
