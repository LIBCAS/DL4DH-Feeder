/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import { MdClose, MdDownload, MdInfo } from 'react-icons/md';
import { BiLinkExternal } from 'react-icons/bi';
import Dialog from '@reach/dialog';

import Checkbox from 'components/form/checkbox/Checkbox';
import SelectInput from 'components/form/select/SelectInput';
import ModalDialog from 'components/modal';
import { Box, Flex } from 'components/styled';
import Button, { NavLinkButton } from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import RadioButton from 'components/styled/RadioButton';
import Text, { H1 } from 'components/styled/Text';
import { Chip } from 'components/form/input/TextInput';

import { useTheme } from 'theme';

import { ExportDto } from 'api/exportsApi';

import {
	ExportFieldOption,
	exportFieldOptions,
	ExportFormatOption,
	ExportSort,
	parseFieldOptions,
} from './exportModels';

type SerializedExportParameters = {
	includeFields: string[];
	excludeFields: string[];
	sorting: ExportSort;
};

const delimiterOptions = [
	{
		id: ',',
		label: 'Čárka',
	},
	{
		id: '\t',
		label: 'Tabulátor',
	},
];

type Props = {
	closeModal: () => void;
	exportDto: ExportDto;
};

const parseParameters = (parameters?: string) => {
	const parsedJson = JSON.parse(
		parameters ?? '{}',
	) as SerializedExportParameters;

	const includeFields = parseFieldOptions(parsedJson.includeFields);
	const excludeFields = parseFieldOptions(parsedJson.excludeFields);
	const sorting = parsedJson.sorting;

	return { includeFields, excludeFields, sorting };
};

const ExportDetail: FC<Props> = ({ closeModal, exportDto }) => {
	const { includeFields, excludeFields, sorting } = parseParameters(
		exportDto.parameters,
	);
	return (
		<Flex
			alignItems="center"
			justifyContent="center"
			overflow="visible"
			m={[1, 5]}
		>
			<Paper bg="paper" minWidth={['80%', 500]} overflow="visible">
				<Box>
					<Flex width={1} justifyContent="space-between" alignItems="center">
						<H1 my={3}>Detail exportu publikace</H1>
						<IconButton color="primary" onClick={closeModal}>
							<MdClose size={32} />
						</IconButton>
					</Flex>
					<Text fontSize="sm">
						Název publikace:
						<NavLinkButton
							variant="text"
							target="_blank"
							ml={1}
							p={0}
							to={`/view/${exportDto.publicationId}`}
						>
							<Text as="span" fontWeight="bold" mr={2}>
								{exportDto.publicationTitle}
							</Text>
							<BiLinkExternal size={14} />
						</NavLinkButton>
					</Text>
					<Text fontSize="sm">
						ID publikace: <b>{exportDto.publicationId}</b>
					</Text>
					<Text my={2} mt={4}>
						Formát: <b>{exportDto.format}</b>
					</Text>

					{exportDto.format === 'CSV' && exportDto.delimiter && (
						<Flex
							my={2}
							alignItems="center"
							justifyContent="space-between"
							mr={2}
						>
							<Text my={2}>
								Rozdělovač:{' '}
								<b>
									{delimiterOptions.find(d => d.id === exportDto.delimiter)
										?.label ?? 'neznámy'}
								</b>
							</Text>
						</Flex>
					)}
					{(includeFields ?? []).length > 0 && (
						<Flex my={3} mr={2}>
							<Text flexShrink={0} my={2}>
								Zahrnuté pole:
							</Text>
							<Flex flexWrap="wrap">
								{includeFields?.map((f, i) => (
									<Chip mx={2} mb={2} p={2} key={`${f.id}${i}`}>
										{f.label}
									</Chip>
								))}
							</Flex>
						</Flex>
					)}

					{(excludeFields ?? []).length > 0 && (
						<Flex my={3} mr={2}>
							<Text flexShrink={0} my={2}>
								Vynechané pole:
							</Text>
							<Flex flexWrap="wrap">
								{excludeFields?.map((f, i) => (
									<Chip mx={2} mb={2} p={2} key={`${f.id}${i}`}>
										{f.label}
									</Chip>
								))}
							</Flex>
						</Flex>
					)}

					<Divider my={3} />
					<Flex my={1} justifyContent="flex-end" alignItems="center">
						<Button variant="primary" ml={3} onClick={closeModal}>
							Zavřít
						</Button>
					</Flex>
				</Box>
			</Paper>
		</Flex>
	);
};

const ExportDetailDialog: FC<{
	exportDto: ExportDto;
	onDismiss: () => void;
	isOpen: boolean;
}> = ({ exportDto, isOpen, onDismiss }) => {
	const theme = useTheme();
	return (
		<Dialog
			onDismiss={onDismiss}
			isOpen={isOpen}
			css={css`
				padding: 0 !important;
				min-width: ${theme.breakpoints[0]};

				@media (max-width: ${theme.breakpoints[0]}) {
					width: 100% !important;
					min-width: unset;
				}
			`}
		>
			<ExportDetail closeModal={onDismiss} exportDto={exportDto} />
		</Dialog>
	);
};

export default ExportDetailDialog;
