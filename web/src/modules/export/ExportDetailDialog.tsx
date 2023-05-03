/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import Dialog from '@reach/dialog';
import { FC } from 'react';
import { MdClose, MdDownload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import { Chip } from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';

import { useTheme } from 'theme';
import { downloadFile, getDateString } from 'utils';
import { api } from 'api';

import { ExportDto } from 'api/exportsApi';

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

	const { t } = useTranslation();

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
						<H1 my={3}>{t('exports:exports_dashboard:detail')}</H1>
						<IconButton color="primary" onClick={closeModal}>
							<MdClose size={32} />
						</IconButton>
					</Flex>
					<Text fontSize="sm">
						{t('exports:exports_dashboard:export_name')}:{' '}
						<Text as="span" fontWeight="bold" mr={2}>
							{exportDto.publicationTitle}
						</Text>
					</Text>
					<Text fontSize="sm">
						Status: <b>{t(`exports:status_enum:${exportDto.status}`)}</b>
					</Text>
					<Text fontSize="sm">
						{t('exports:exports_dashboard:created')}:{' '}
						<b>
							{exportDto.created
								? getDateString(new Date(exportDto.created))
								: '--'}
						</b>
					</Text>
					{(exportDto.status === 'COMPLETED' ||
						exportDto.status == 'SUCCESSFUL') && (
						<Text fontSize="md">
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
									<Text my={0} py={0} px={1} fontSize="lg">
										{t('exports:exports_dashboard:download')}
									</Text>{' '}
									<MdDownload size={16} />
								</Flex>
							</IconButton>
						</Text>
					)}
					<Divider mt={3} mb={3} />

					<Box fontSize="md" mt={2}>
						<Text my={2}>
							{t('exports:exports_dashboard:format')}: <b>{exportDto.format}</b>
						</Text>

						{exportDto.format === 'CSV' && exportDto.delimiter && (
							<Flex
								my={2}
								alignItems="center"
								justifyContent="space-between"
								mr={2}
							>
								<Text my={2}>
									{t('exports:dialog:delimiter')}:{' '}
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
									{t('exports:dialog:include_fields')}:{' '}
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
									{t('exports:dialog:exclude_fields')}:{' '}
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
									{t('exports:dialog:altoParams')}:{' '}
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
									{t('exports:dialog:nameTagParams')}:{' '}
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
									{t('exports:dialog:udPipeParams')}:{' '}
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
							{t('common:cancel')}
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
