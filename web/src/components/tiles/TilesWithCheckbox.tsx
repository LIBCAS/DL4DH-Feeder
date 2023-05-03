/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useMemo, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import ModalDialog from 'components/modal';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';
import Divider from 'components/styled/Divider';

import ListView from 'modules/searchResult/list';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';
import TileView from 'modules/searchResult/tiles/TileView';
import DashboardModeSwither from 'modules/public/homepage/DashboardViewModeSwitcher';
import { usePublicationContext2 } from 'modules/publication/ctx/pubContext';

import { useTheme } from 'theme';
import { pluralRules } from 'utils';

import { PublicationChild, PublicationDto } from 'api/models';

import { useBulkExportContext } from 'hooks/useBulkExport';
import { useSearchContext } from 'hooks/useSearchContext';

type FormProps = {
	closeModal: () => void;
	variant: string;
	title: string;
	actionButton: (selected: string[]) => JSX.Element;
	preSelected?: string[];
	checkLimit?: number;
} & (
	| {
			variant: 'publication';

			data: PublicationDto[];
	  }
	| {
			variant: 'periodical';

			data: PublicationChild[];
	  }
);

const TilesWithCheckboxForm: FC<FormProps> = ({
	closeModal,
	variant,
	data,
	title,
	actionButton,
	preSelected,
	checkLimit,
}) => {
	const [selected, setSelected] = useState<string[]>(
		preSelected ?? data.map((d: { pid: string }) => d.pid),
	);
	const { t } = useTranslation();
	const Tiles = variant === 'periodical' ? PeriodicalTiles : TileView;
	const tilesData = data as PublicationChild[] & PublicationDto[];

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
					<H1>{title}</H1>
					<IconButton color="primary" onClick={closeModal}>
						<MdClose size={32} />
					</IconButton>
				</Flex>
				<Box
					overflowX="hidden"
					overflowY="auto"
					maxHeight="70vh"
					p={3}
					bg="white"
					css={css`
						border: 1px solid ${theme.colors.border};
					`}
				>
					<Tiles
						data={tilesData}
						onSelect={uuid => {
							if (selected.find(s => s === uuid)) {
								setSelected(p => p.filter(s => s !== uuid));
							} else {
								setSelected(p => [...p, uuid]);
							}
						}}
						//gridGap={3}
						tileWrapperCss={(uuid: string) => {
							const isActive = selected.find(s => s === uuid);

							return css`
								${isActive &&
								css`
									&::after {
										content: '';
										display: block;
										color: white;
										padding-bottom: 8px;
										position: absolute;
										background-image: url('/assets/checkmark.svg');
										filter: invert();
										background-repeat: no-repeat;
										background-position: center;
										background-color: #fc7658;
										border: 1px solid #fc7658;
										border-radius: 50%;
										opacity: 0.8;
										top: 5px;
										left: 5px;
										width: 40px;
										height: 30px;
									}
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
								{t(`pdf-dialog:selection1:${pluralRules(selected.length)}`)}
								<Text
									as="span"
									fontWeight="bold"
									color={
										checkLimit && selected.length > checkLimit
											? 'error'
											: 'text'
									}
								>
									{' '}
									{selected.length}
								</Text>{' '}
								{t(`pdf-dialog:selection2:${pluralRules(selected.length)}`)}{' '}
								{checkLimit && (
									<>
										(limit{' '}
										<Text
											as="span"
											fontWeight="bold"
											color={selected.length > checkLimit ? 'error' : 'text'}
										>
											{checkLimit}
										</Text>
										)
									</>
								)}
							</Text>
						) : (
							<Text>{t('pdf-dialog:selection')}</Text>
						)}

						{data.length !== selected.length && (
							<Button
								fontSize="md"
								variant="text"
								px={1}
								fontWeight="bold"
								onClick={() => setSelected(data.map(p => p.pid))}
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
						{actionButton(selected)}
					</Flex>
				</Flex>
				{checkLimit && selected.length > checkLimit && (
					<Text py={0} my={0} color="error">
						{t('pdf-dialog:warning_too_manny_pages')}
					</Text>
				)}
			</Paper>
		</Flex>
	);
};

type Props = {
	onEdit: (selected: string[]) => void;
	preSelected: string[];
	disabled?: boolean;
};

export const EditSelectedChildren: FC<Props> = ({
	onEdit,
	preSelected,
	disabled,
}) => {
	const { getChildren } = usePublicationContext2();
	const data = useMemo(() => getChildren?.() ?? [], [getChildren]);
	const { t } = useTranslation();
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button
					px={1}
					variant="text"
					onClick={openModal}
					tooltip={
						disabled ? t('exports:dialog:json_csv_only') : t('common:edit')
					}
					fontSize="md"
					disabled={disabled}
				>
					{t('common:edit')}
				</Button>
			)}
		>
			{closeModal => (
				<TilesWithCheckboxForm
					preSelected={preSelected}
					closeModal={closeModal}
					data={data ?? []}
					variant="periodical"
					title={t('exports:dialog:edit_export_list')}
					actionButton={selected => (
						<Button
							disabled={selected.length < 1}
							variant="primary"
							onClick={() => {
								onEdit(selected);
								closeModal();
							}}
						>
							{t('common:confirm')}
						</Button>
					)}
				/>
			)}
		</ModalDialog>
	);
};

export const EditSelectedPublications: FC<Props> = ({ disabled, onEdit }) => {
	const { uuidHeap } = useBulkExportContext();
	const { t } = useTranslation('exports');
	const { state } = useSearchContext();
	const [sort, setSort] = useState(false);
	const data: PublicationDto[] = useMemo(() => {
		return sort
			? Object.keys(uuidHeap)
					.sort(
						(a, b) =>
							(uuidHeap[a].selected ? 0 : 1) - (uuidHeap[b].selected ? 0 : 1),
					)
					.map(
						k =>
							({
								title: uuidHeap[k].title,
								enriched: uuidHeap[k].enriched,
								policy: uuidHeap[k].policy,
								availability: uuidHeap[k].policy,
								model: uuidHeap[k].model,
								pid: k,
							} as PublicationDto),
					)
			: Object.keys(uuidHeap).map(
					k =>
						({
							title: uuidHeap[k].title,
							enriched: uuidHeap[k].enriched,
							policy: uuidHeap[k].policy,
							availability: uuidHeap[k].policy,
							model: uuidHeap[k].model,
							pid: k,
						} as PublicationDto),
			  );
	}, [uuidHeap, sort]);

	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button
					px={1}
					variant="text"
					onClick={openModal}
					tooltip={t('common:edit')}
					fontSize="md"
					disabled={disabled}
				>
					{t('common:edit')}
				</Button>
			)}
			onClose={() => onEdit?.([])}
		>
			{closeModal => (
				<Flex
					alignItems="center"
					justifyContent="center"
					overflow="visible"
					m={0}
				>
					<Paper
						bg="paper"
						margin="5vh auto"
						m={0}
						minWidth={['initial', '80vw']}
						maxHeight="75vh"
						overflow="visible"
						width={'100%'}
					>
						<Flex alignItems="center" justifyContent="space-between">
							<H1>{t('export_dialog_list.title')}</H1>
							<Flex>
								<Flex
									bg="primaryLight"
									alignItems="center"
									justifyContent="center"
									width={40}
									height={36}
								>
									<IconButton
										color="primary"
										onClick={() => setSort(p => !p)}
										tooltip={
											sort
												? t('export_dialog_list.tooltip_sort_on')
												: t('export_dialog_list.tooltip_sort_off')
										}
									>
										{sort ? (
											<FaSortAmountDown size={22} />
										) : (
											<FaSortAmountUp size={22} />
										)}
									</IconButton>
								</Flex>
								<DashboardModeSwither graphViewHidden />
							</Flex>
						</Flex>
						{state.viewMode === 'list' && (
							<ListView data={data} isLoading={false} />
						)}{' '}
						{state.viewMode === 'tiles' && (
							<Flex overflowY="scroll" p={3}>
								<TileView data={data} />
							</Flex>
						)}
						<Divider my={2} />
						<Flex m={2} justifyContent="flex-end">
							<Button
								variant="primary"
								onClick={() => {
									onEdit?.([]);
									closeModal();
								}}
							>
								{t('common:cancel')}
							</Button>
						</Flex>
					</Paper>
				</Flex>
			)}
		</ModalDialog>
	);
};
