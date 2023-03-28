/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled/macro';
import Dialog from '@reach/dialog';
import { FC, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import { OperationToTextLabel } from 'components/search/MainSearchInput';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import Text, { H4 } from 'components/styled/Text';

import { useTheme } from 'theme';

export type StatItem = {
	label: string;
	value?: number;
	key: string;
	bold?: boolean;
};

const Cell = styled(Text)`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0;
	margin: 0;
`;

export const StatList: FC<{
	items: StatItem[];
	maxRows?: number;
	refresh?: () => void;
	onClick?: (key: string, operation?: 'EQUAL' | 'NOT_EQUAL') => void;
	customDialog?: boolean;
	listId?: string;
}> = ({ items, maxRows, refresh, onClick, customDialog, listId }) => {
	const [exp, setExp] = useState<boolean>(!maxRows);
	const [dialogOpen, setDialogOpen] = useState<string>('');
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<>
			{(maxRows && !exp ? items.slice(0, maxRows) : items).map((item, i) => (
				<Flex
					key={item.label + i}
					justifyContent="space-between"
					alignItems="center"
					title={`Přidat filtr: ${item.label}`}
					position="relative"
					fontWeight={item.bold ? 'bold' : 'unset'}
					fontSize="13px"
					onClick={() => {
						if (!customDialog) {
							onClick?.(item.key);
							return;
						}
						setDialogOpen(item.key);
					}}
					lineHeight={1}
					px={2}
					py={1}
					css={css`
						cursor: pointer;
						text-decoration: ${item.bold ? 'underline' : 'unset'};
						&:hover {
							background-color: rgba(0, 0, 0, 0.06);
							color: black;
						}
					`}
				>
					{customDialog && dialogOpen === item.key && (
						<Flex position="relative">
							<Dialog isOpen>
								<Paper>
									<H4>{t('nametag:choose_operation')}</H4>
									<Flex
										width={1}
										alignItems="center"
										justifyContent="center"
										flexDirection="column"
									>
										<Text fontSize="xl">{listId}</Text>

										<Flex alignItems="center" flexDirection="row" my={2}>
											<Button
												m={1}
												variant="primary"
												onClick={() => {
													onClick?.(item.key, 'EQUAL');
												}}
											>
												{OperationToTextLabel['EQUAL']}
												<Text ml="2" my={0} p={0}>
													{t('nametag:EQUAL')}
												</Text>
											</Button>

											<Button
												m={1}
												variant="primary"
												onClick={() => {
													onClick?.(item.key, 'NOT_EQUAL');
												}}
											>
												{OperationToTextLabel['NOT_EQUAL']}
												<Text ml="2" my={0} p={0}>
													{t('nametag:NOT_EQUAL')}
												</Text>
											</Button>
										</Flex>
										<Text fontSize="xl">
											{'"'}
											{item.key}
											{'"'}
										</Text>
									</Flex>
									<Button
										m={1}
										variant="text"
										onClick={() => {
											setDialogOpen('');
										}}
									>
										{t('common:cancel')}
									</Button>
								</Paper>
							</Dialog>
						</Flex>
					)}
					<Cell maxWidth={200}>{item.label}</Cell>
					<Text py={0} my={0}>
						{item?.value ?? ''}
					</Text>
				</Flex>
			))}
			{maxRows && items.length > maxRows && !exp ? (
				<Button
					p={0}
					mt={2}
					variant="text"
					onClick={() => {
						setExp(p => !p);
						refresh?.();
					}}
				>
					<Text fontWeight="bold">{t('filters:btn_show_more')}</Text>
					<Flex color="primary">
						<MdExpandMore
							size={22}
							color="primary"
							css={css`
								transform: rotate(${exp ? 180 : 0}deg);
								transition: 0.2s ease;
							`}
						/>
					</Flex>
				</Button>
			) : (
				<>
					{maxRows && items.length > maxRows && (
						<Button
							p={0}
							mt={2}
							variant="text"
							onClick={() => {
								setExp(p => !p);
								refresh?.();
							}}
						>
							<Text fontWeight="bold">{t('filters:btn_show_less')}</Text>
							<Flex color="primary">
								<MdExpandMore
									size={22}
									color="primary"
									css={css`
										transform: rotate(${exp ? 180 : 0}deg);
										transition: 0.2s ease;
									`}
								/>
							</Flex>
						</Button>
					)}
				</>
			)}
		</>
	);
};

export default StatList;
