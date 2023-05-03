/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useMemo, useState } from 'react';
import { MdClose, MdPrint } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import ModalDialog from 'components/modal';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';

import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';

import { SelectedOverlayCss, useTheme } from 'theme';
import { downloadFile, pluralRules } from 'utils';

import { callPrintApi } from 'api/printApi';

import { usePublicationContext2 } from '../ctx/pubContext';

type FormProps = {
	closeModal: () => void;
};

const PRINT_LIMIT = 90;

const PrintForm: FC<FormProps> = ({ closeModal }) => {
	const { getChildren } = usePublicationContext2();
	const pages = useMemo(() => getChildren?.() ?? [], [getChildren]);
	const { t } = useTranslation();
	const [selected, setSelected] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const theme = useTheme();

	return (
		<Flex alignItems="center" justifyContent="center" overflow="visible" m={0}>
			<Paper
				bg="paper"
				margin="5vh auto"
				m={0}
				minWidth={['initial', '80vw']}
				overflow="visible"
				width={'100%'}
				//height={'80vh'}
			>
				<Flex alignItems="center" justifyContent="space-between">
					<H1>{t('pdf-dialog:title_prepare')}</H1>
					<IconButton color="primary" onClick={closeModal}>
						<MdClose size={32} />
					</IconButton>
				</Flex>
				<Box
					overflowX="hidden"
					overflowY="auto"
					maxHeight="68vh"
					bg="white"
					css={css`
						border: 1px solid ${theme.colors.border};
					`}
				>
					<PeriodicalTiles
						data={pages}
						onSelect={uuid => {
							if (selected.find(s => s === uuid)) {
								setSelected(p => p.filter(s => s !== uuid));
							} else {
								setSelected(p => [...p, uuid]);
							}
						}}
						gridGap={3}
						tileWrapperCss={(uuid: string) => {
							const isActive = selected.find(s => s === uuid);

							return css`
								${isActive &&
								css`
									${SelectedOverlayCss}
								`}
							`;
						}}
					/>
				</Box>
				<Flex
					justifyContent="space-between"
					alignItems="center"
					bg="paper"
					pt={2}
					mt={2}
					width={1}
				>
					<Flex alignItems="center">
						{selected.length > 0 ? (
							<Text fontSize="md">
								{t(`pdf-dialog:selection1:${pluralRules(selected.length)}`)}{' '}
								<Text
									as="span"
									fontWeight="bold"
									color={selected.length > PRINT_LIMIT ? 'error' : 'text'}
								>
									{' '}
									{selected.length}
								</Text>{' '}
								{t(`pdf-dialog:selection2:${pluralRules(selected.length)}`)}{' '}
								(limit{' '}
								<Text
									as="span"
									fontWeight="bold"
									color={selected.length > PRINT_LIMIT ? 'error' : 'text'}
								>
									{PRINT_LIMIT}
								</Text>
								)
							</Text>
						) : (
							<Text>{t('pdf-dialog:selection')}</Text>
						)}

						{pages.length !== selected.length && (
							<Button
								fontSize="md"
								variant="text"
								px={1}
								fontWeight="bold"
								onClick={() => setSelected(pages.map(p => p.pid))}
							>
								| {t('pdf-dialog:select_all')}
							</Button>
						)}
						{selected.length > 0 && (
							<Button
								fontSize="md"
								variant="text"
								fontWeight="bold"
								px={1}
								onClick={() => setSelected([])}
							>
								| {t('pdf-dialog:deselect_all')}
							</Button>
						)}
					</Flex>
					<Flex alignItems="center">
						<Button fontSize="md" variant="text" mx={3} onClick={closeModal}>
							{t('common:cancel')}
						</Button>
						<Button
							variant="primary"
							loading={loading}
							disabled={
								loading || selected.length < 1 || selected.length > PRINT_LIMIT
							}
							onClick={async () => {
								setLoading(true);
								try {
									const response = await callPrintApi(selected);
									const blob = await response.blob();
									const url = URL.createObjectURL(blob);
									downloadFile(url, 'publicaton_print.pdf');
									//window.open(url, '_blank');
								} catch (error) {
									toast.error(t('pdf-dialog:error_generate'));
									console.log(error);
								}

								setLoading(false);
							}}
						>
							{t('pdf-dialog:action_prepare')}
						</Button>
					</Flex>
				</Flex>
				{selected.length > PRINT_LIMIT && (
					<Text py={0} my={0} color="error">
						{t('pdf-dialog:warning_too_manny_pages')}
					</Text>
				)}
			</Paper>
		</Flex>
	);
};

const PrintDialog = () => {
	const { t } = useTranslation();
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<IconButton
					color="primary"
					onClick={openModal}
					tooltip={t('pdf-dialog:title_prepare')}
				>
					<MdPrint size={24} />
				</IconButton>
			)}
		>
			{closeModal => <PrintForm closeModal={closeModal} />}
		</ModalDialog>
	);
};

export default PrintDialog;
