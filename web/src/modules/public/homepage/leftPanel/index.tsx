/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled/macro';
import Dialog from '@reach/dialog';
import { FC, useCallback, useMemo, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import MyAccordion from 'components/accordion';
import LoaderSpin from 'components/loaders/LoaderSpin';
import { OperationToTextLabel } from 'components/search/MainSearchInput';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import Text, { H4 } from 'components/styled/Text';

import { useTheme } from 'theme';

import { AvailableFilters, ModelsEnum } from 'api/models';

import { modelToText } from 'utils/enumsMap';
import { mapLangToCS } from 'utils/languagesMap';

import ActiveFilters from './ActiveFilters';
import NameTagFilter from './NameTagFilter';
import PublishDateFilter from './PublishDateFilter';

export type StatItem = {
	label: string;
	value: number;
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

	return (
		<>
			{(maxRows && !exp ? items.slice(0, maxRows) : items).map((item, i) => (
				<Flex
					key={item.label + i}
					justifyContent="space-between"
					alignItems="center"
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
					css={css`
						cursor: pointer;
						&:hover {
							background-color: ${theme.colors.primary};
							color: white;
						}
					`}
				>
					{customDialog && dialogOpen === item.key && (
						<Flex position="relative">
							<Dialog isOpen>
								<Paper>
									<H4>Zvolte operaci</H4>
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
													je
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
													není
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
										Zrušit
									</Button>
								</Paper>
							</Dialog>
						</Flex>
					)}
					<Cell maxWidth={200}>{item.label}</Cell>
					<Text> {item.value}</Text>
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
					<Text fontWeight="bold">Zobrazit vice</Text>
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
							<Text fontWeight="bold">Zobrazit méně</Text>
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

type Props = {
	data?: AvailableFilters;
	isLoading?: boolean;
};

const SearchResultLeftPanel: FC<Props> = ({ data, isLoading }) => {
	const yearsInterval = useMemo(() => {
		const years = data?.years;
		if (years) {
			const numYears = Object.keys(years)
				.map(k => parseInt(k))
				.filter(y => y !== 0);
			return { maxYear: Math.max(...numYears), minYear: Math.min(...numYears) };
		} else {
			return undefined;
		}
	}, [data]);

	const enrichedItems: StatItem[] = useMemo(
		() => [
			{
				label: 'Pouze obohacené',
				value: data?.enrichment.ENRICHED ?? 0,
				key: 'ENRICHED',
			},
			{
				key: 'NOT_ENRICHED',
				label: 'Pouze neobohacené',
				value: data?.enrichment.NOT_ENRICHED ?? 0,
			},
		],
		[data],
	);
	const avalItems: StatItem[] = useMemo(
		() => [
			{
				label: 'Pouze veřejné',
				value: data?.availability.public ?? 0,
				key: 'PUBLIC',
			},
			{
				key: 'PRIVATE',
				label: 'Pouze neveřejné',
				value: data?.availability.private ?? 0,
			},
			{
				key: 'ALL',
				label: 'Všechny',
				value:
					(data?.availability.private ?? 0) + (data?.availability.public ?? 0),
			},
		],
		[data],
	);

	const modelItems: StatItem[] = useMemo(
		() =>
			data?.models
				? [
						...Object.keys(data?.models).map(key => ({
							label: modelToText(key as ModelsEnum),
							key,
							value: data.models[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.models],
	);

	const keywordsItems: StatItem[] = useMemo(
		() =>
			data?.keywords
				? [
						...Object.keys(data?.keywords).map(key => ({
							key,
							label: key,
							value: data.keywords[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.keywords],
	);
	const authorsItems: StatItem[] = useMemo(
		() =>
			data?.authors
				? [
						...Object.keys(data?.authors).map(key => ({
							key,
							label: key,
							value: data.authors[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.authors],
	);
	const languagesItems: StatItem[] = useMemo(
		() =>
			data?.languages
				? [
						...Object.keys(data?.languages).map(key => ({
							key,
							label: mapLangToCS?.[key] ?? key,
							value: data.languages[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.languages],
	);

	const [searchParams, setSearchParams] = useSearchParams();

	const handleUpdateFilter = useCallback(
		(type: string) => (key: string) => {
			searchParams.append(type, key);
			searchParams.delete('page');
			setSearchParams(searchParams);
		},
		[searchParams, setSearchParams],
	);

	const handleChangeFilter = useCallback(
		(type: string) => (key: string) => {
			searchParams.set(type, key);
			searchParams.delete('page');
			setSearchParams(searchParams);
		},
		[searchParams, setSearchParams],
	);
	if (isLoading) {
		return (
			<Box p={2} width={1}>
				<LoaderSpin />
			</Box>
		);
	}
	return (
		<Box px={0} width={1}>
			<ActiveFilters />

			{avalItems.length > 0 && (
				<MyAccordion
					label="Dostupnost"
					isExpanded
					isLoading={isLoading}
					storeKey="availability"
				>
					{onRefresh => (
						<StatList
							items={avalItems}
							onClick={handleChangeFilter('availability')}
							refresh={onRefresh}
						/>
					)}
				</MyAccordion>
			)}
			<MyAccordion
				label="Obohacení"
				isExpanded
				isLoading={isLoading}
				storeKey="enrichment"
			>
				{onRefresh => (
					<StatList
						items={enrichedItems}
						onClick={handleChangeFilter('enrichment')}
						refresh={onRefresh}
					/>
				)}
			</MyAccordion>
			{modelItems.length > 0 && (
				<MyAccordion
					label="Typ dokumentu"
					isExpanded
					isLoading={isLoading}
					storeKey="models"
				>
					{onRefresh => (
						<StatList
							items={modelItems}
							onClick={handleUpdateFilter('models')}
							refresh={onRefresh}
						/>
					)}
				</MyAccordion>
			)}
			{keywordsItems.length > 0 && (
				<MyAccordion
					label="Klíčové slovo"
					isExpanded
					isLoading={isLoading}
					storeKey="keywords"
				>
					{onRefresh => (
						<StatList
							items={keywordsItems}
							maxRows={3}
							refresh={onRefresh}
							onClick={handleUpdateFilter('keywords')}
						/>
					)}
				</MyAccordion>
			)}
			{authorsItems.length > 0 && (
				<MyAccordion
					label="Autor"
					isExpanded
					isLoading={isLoading}
					storeKey="authors"
				>
					{onRefresh => (
						<StatList
							items={authorsItems}
							maxRows={3}
							refresh={onRefresh}
							onClick={handleUpdateFilter('authors')}
						/>
					)}
				</MyAccordion>
			)}
			{languagesItems.length > 0 && (
				<MyAccordion label="Jazyk" isLoading={isLoading} storeKey="languages">
					{onRefresh => (
						<StatList
							items={languagesItems}
							maxRows={3}
							refresh={onRefresh}
							onClick={handleUpdateFilter('languages')}
						/>
					)}
				</MyAccordion>
			)}

			<MyAccordion
				label="Rok vydání"
				isExpanded
				isLoading={isLoading}
				storeKey="publishDateFilter"
			>
				<PublishDateFilter interval={yearsInterval} />
			</MyAccordion>

			<NameTagFilter />

			<Box height="50px" />
		</Box>
	);
};

// export default memo(SearchResultLeftPanel, (prevProps, nextProps) => {
// 	console.log({ prevProps, nextProps });
// 	return _.isEqual(prevProps, nextProps);
// });

export default SearchResultLeftPanel;
