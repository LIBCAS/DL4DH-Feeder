/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import Dialog from '@reach/dialog';
import { FC } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { MdClose, MdDownload } from 'react-icons/md';

import { Chip } from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Button, { NavLinkButton } from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';

import { useTheme } from 'theme';
import { downloadFile, getDateString } from 'utils';
import { api } from 'api';

import { ExportDto } from 'api/exportsApi';

import { ExportJobStatusToText } from 'utils/enumsMap';

import {
	AltoParam,
	ExportSort,
	parseFieldOptions,
	PipeParam,
	TagParam,
	Delimiter,
	ExportFieldOption,
} from './exportModels';

type SerializedExportParameters = {
	includeFields: string[];
	excludeFields: string[];
	sorting: ExportSort[];
	delimiter?: Delimiter;
	altoParams?: AltoParam[];
	nameTagParams?: TagParam[];
	udPipeParams?: PipeParam[];
};

type ParsedExportParameters = {
	includeFields: ExportFieldOption[];
	excludeFields: ExportFieldOption[];
	sorting: ExportSort[];
	delimiter?: Delimiter;
	altoParams?: AltoParam[];
	nameTagParams?: TagParam[];
	udPipeParams?: PipeParam[];
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

const parseParameters = (
	parameters?: string,
	variant: 'teiParameters' | 'parameters' = 'parameters',
): Partial<ParsedExportParameters> => {
	if (variant === 'teiParameters') {
		const { altoParams, nameTagParams, udPipeParams } = JSON.parse(
			parameters ?? '{}',
		) as SerializedExportParameters;

		return { altoParams, nameTagParams, udPipeParams };
	}
	const {
		includeFields: parsedIF,
		excludeFields: parsedEF,
		...rest
	} = JSON.parse(parameters ?? '{}') as SerializedExportParameters;

	const includeFields = parseFieldOptions(parsedIF);
	const excludeFields = parseFieldOptions(parsedEF);

	return { includeFields, excludeFields, ...rest };
};

const ExportDetail: FC<Props> = ({ closeModal, exportDto }) => {
	const { includeFields, excludeFields } = parseParameters(
		exportDto.parameters,
	);
	const { altoParams, nameTagParams, udPipeParams } = parseParameters(
		exportDto.teiParameters,
		'teiParameters',
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
					<Text fontSize="sm">
						Status: <b>{ExportJobStatusToText[exportDto.status]}</b>
					</Text>
					<Text fontSize="sm">
						Vytvořeno:{' '}
						<b>
							{exportDto.created
								? getDateString(new Date(exportDto.created))
								: '--'}
						</b>
					</Text>
					{(exportDto.status === 'COMPLETED' || exportDto.status == 'SUCCESSFUL') && (
						<Text fontSize="sm">
							Výsledek:
							<IconButton
								onClick={async e => {
									e.stopPropagation();
									const file = await api().get(
										`exports/download/${exportDto.id}`,
									);

									const blob = await file.blob();
									const url = URL.createObjectURL(blob);
									downloadFile(
										url,
										`${exportDto?.publicationTitle ?? exportDto.id}.zip`,
									);
								}}
							>
								<Flex
									alignItems="center"
									pr={1}
									py={0}
									color="primary"
									fontWeight="bold"
								>
									<Text my={0} py={0} px={1}>
										Stáhnout
									</Text>{' '}
									<MdDownload size={16} />
								</Flex>
							</IconButton>
						</Text>
					)}
					<Divider mt={3} mb={3} />

					<Box fontSize="md" mt={2}>
						<Text my={2}>
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
							<Flex my={2} mr={2}>
								<Text flexShrink={0} my={2}>
									Zahrnuté pole:
								</Text>
								<Flex flexWrap="wrap">
									{includeFields?.map((f, i) => (
										<Chip mx={2} mb={2} px={2} py={1} key={`${f.id}${i}`}>
											{f.label}
										</Chip>
									))}
								</Flex>
							</Flex>
						)}

						{(excludeFields ?? []).length > 0 && (
							<Flex my={2} mr={2}>
								<Text flexShrink={0} my={2}>
									Vynechané pole:
								</Text>
								<Flex flexWrap="wrap">
									{excludeFields?.map((f, i) => (
										<Chip mx={2} mb={2} px={2} py={1} key={`${f.id}${i}`}>
											{f.label}
										</Chip>
									))}
								</Flex>
							</Flex>
						)}
						{(altoParams ?? []).length > 0 && (
							<Flex my={2} mr={2}>
								<Text flexShrink={0} my={2}>
									Alto Params:
								</Text>
								<Flex flexWrap="wrap">
									{altoParams?.map((p, i) => (
										<Chip mx={2} mb={2} px={2} py={1} key={`${p}${i}`}>
											{p}
										</Chip>
									))}
								</Flex>
							</Flex>
						)}
						{(nameTagParams ?? []).length > 0 && (
							<Flex my={2} mr={2}>
								<Text flexShrink={0} my={2}>
									NameTag Params:
								</Text>
								<Flex flexWrap="wrap">
									{nameTagParams?.map((p, i) => (
										<Chip mx={2} mb={2} px={2} py={1} key={`${p}${i}`}>
											{p}
										</Chip>
									))}
								</Flex>
							</Flex>
						)}
						{(udPipeParams ?? []).length > 0 && (
							<Flex my={2} mr={2}>
								<Text flexShrink={0} my={2}>
									udPipe Params:
								</Text>
								<Flex flexWrap="wrap">
									{udPipeParams?.map((p, i) => (
										<Chip mx={2} mb={2} px={2} py={1} key={`${p}${i}`}>
											{p}
										</Chip>
									))}
								</Flex>
							</Flex>
						)}
					</Box>
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
