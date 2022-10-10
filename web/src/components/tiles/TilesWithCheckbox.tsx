/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useMemo, useState } from 'react';
import { MdClose, MdPrint } from 'react-icons/md';
import { toast } from 'react-toastify';

import ModalDialog from 'components/modal';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';

import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';
import TileView from 'modules/searchResult/tiles/TileView';
import { usePublicationContext } from 'modules/publication/ctx/pub-ctx';
import ListView from 'modules/searchResult/list';

import { useTheme } from 'theme';
import { downloadFile } from 'utils';

import { callPrintApi } from 'api/printApi';
import { PublicationChild, PublicationDto } from 'api/models';
import { useExportList } from 'api/exportsApi';

import { useSearchResultContext } from 'hooks/useSearchResultContext';
import { useSearchContext } from 'hooks/useSearchContext';
import { useBulkExportContext } from 'hooks/useBulkExport';

type FormProps = {
	closeModal: () => void;
	isSecond?: boolean;
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
								Máte vybrané{' '}
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
								strany{' '}
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
							<Text>Nemáte vybranou žádnou stranu</Text>
						)}

						{data.length !== selected.length && (
							<Button
								fontSize="md"
								variant="text"
								px={1}
								fontWeight="bold"
								onClick={() => setSelected(data.map(p => p.pid))}
							>
								| Vybrat vše
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
								| Zrušit výběr
							</Button>
						)}
					</Flex>
					<Flex alignItems="center">
						<Button fontSize="md" variant="text" mx={3} onClick={closeModal}>
							Zrušit
						</Button>
						{actionButton(selected)}
					</Flex>
				</Flex>
				{checkLimit && selected.length > checkLimit && (
					<Text py={0} my={0} color="error">
						Je překročen maximální počet stran
					</Text>
				)}
			</Paper>
		</Flex>
	);
};

type Props = {
	isSecond?: boolean;
	onEdit: (selected: string[]) => void;
	preSelected: string[];
	disabled?: boolean;
};

export const EditSelectedChildren: FC<Props> = ({
	isSecond,
	onEdit,
	preSelected,
	disabled,
}) => {
	const {
		publicationChildrenFiltered,
		publicationChildren,
		publicationChildrenFilteredOfSecond,
		publicationChildrenOfSecond,
	} = usePublicationContext();

	const data = isSecond
		? publicationChildrenFilteredOfSecond ?? publicationChildrenOfSecond
		: publicationChildrenFiltered ?? publicationChildren;
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button
					px={1}
					variant="text"
					onClick={openModal}
					tooltip={disabled ? 'Dostupné jen pro JSON a CSV' : 'Upravit seznam'}
					fontSize="md"
					disabled={disabled}
				>
					Upravit
				</Button>
			)}
		>
			{closeModal => (
				<TilesWithCheckboxForm
					preSelected={preSelected}
					closeModal={closeModal}
					isSecond={isSecond}
					data={data ?? []}
					variant="periodical"
					title="Upravit seznam pro export"
					actionButton={selected => (
						<Button
							disabled={selected.length < 1}
							variant="primary"
							onClick={() => {
								onEdit(selected);
								closeModal();
							}}
						>
							Potvrdit
						</Button>
					)}
				/>
			)}
		</ModalDialog>
	);
};

export const EditSelectedPublications: FC<Props> = ({ disabled }) => {
	const { uuidHeap } = useBulkExportContext();
	const data = useMemo(
		() => Object.keys(uuidHeap).map(k => uuidHeap[k].publication),
		[uuidHeap],
	);

	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button
					px={1}
					variant="text"
					onClick={openModal}
					tooltip="Upravit seznam"
					fontSize="md"
					disabled={disabled}
				>
					Upravit
				</Button>
			)}
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
						overflow="visible"
						width={'100%'}
						//height={'80vh'}
					>
						<Flex alignItems="center" justifyContent="space-between">
							<H1>Seznam publikací pro export</H1>
						</Flex>
						<ListView data={data} isLoading={false} />
						<Flex m={2} justifyContent="flex-end">
							<Button
								variant="primary"
								onClick={() => {
									closeModal();
								}}
							>
								Potvrdit
							</Button>
						</Flex>
					</Paper>
				</Flex>
			)}
		</ModalDialog>
	);
};
