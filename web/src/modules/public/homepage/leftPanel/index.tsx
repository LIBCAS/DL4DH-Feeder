/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled/macro';
import { isEqual } from 'lodash-es';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { MdBolt, MdClose, MdExpandMore } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import Dialog from '@reach/dialog';

import MyAccordion from 'components/accordion';
import LoaderSpin from 'components/loaders/LoaderSpin';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text, { H4 } from 'components/styled/Text';
import ModalDialog from 'components/modal';
import Paper from 'components/styled/Paper';

import { useTheme } from 'theme';

import {
	AvailableFilters,
	AvailableNameTagFilters,
	ModelsEnum,
	NameTagCode,
	NameTagCodeFilter,
	OperationCode,
} from 'api/models';

import { modelToText } from 'utils/enumsMap';

import ActiveFilters from './ActiveFilters';
import NameTagFilter from './NameTagFilter';
import PublishDateFilter from './PublishDateFilter';

type StatItem = {
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

const StatList: FC<{
	items: StatItem[];
	maxRows?: number;
	refresh?: () => void;
	onClick?: (key: string, operation?: 'EQUAL' | 'NOT_EQUAL') => void;
	customDialog?: boolean;
}> = ({ items, maxRows, refresh, onClick, customDialog }) => {
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
					{' '}
					{customDialog && dialogOpen === item.key && (
						<Flex
							position="absolute"
							width="100%"
							height="100%"
							top="-10px"
							left="0"
							bg="white"
							flexDirection="row"
							p={2}
							mb={4}
							zIndex={30}
						>
							<Dialog isOpen>
								<Paper alignItems="center">
									<Text>Operace</Text>
									<Button
										m={1}
										variant="primary"
										onClick={() => {
											onClick?.(item.key, 'EQUAL');
										}}
									>
										{'JE'}
									</Button>
									<Button
										m={1}
										variant="primary"
										onClick={() => {
											onClick?.(item.key, 'NOT_EQUAL');
										}}
									>
										{'NEN??'}
									</Button>
									<Button
										m={1}
										variant="primary"
										onClick={() => {
											setDialogOpen('');
											//	closeModal();
										}}
									>
										Zav????t
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
							<Text fontWeight="bold">Zobrazit m??n??</Text>
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
	nameTagData?: AvailableNameTagFilters;
	isLoading?: boolean;
};

const SearchResultLeftPanel: FC<Props> = ({ data, nameTagData, isLoading }) => {
	const enrichedItems: StatItem[] = useMemo(
		() => [
			{
				label: 'Pouze obohacen??',
				value: data?.enrichment.ENRICHED ?? 0,
				key: 'ENRICHED',
			},
			{
				key: 'NOT_ENRICHED',
				label: 'Pouze neobohacen??',
				value: data?.enrichment.NOT_ENRICHED ?? 0,
			},
		],
		[data],
	);
	const avalItems: StatItem[] = useMemo(
		() => [
			{
				label: 'Pouze ve??ejn??',
				value: data?.availability.public ?? 0,
				key: 'PUBLIC',
			},
			{
				key: 'PRIVATE',
				label: 'Pouze neve??ejn??',
				value: data?.availability.private ?? 0,
			},
			{
				key: 'ALL',
				label: 'V??echny',
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
							label: key,
							value: data.languages[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.languages],
	);

	const nameTagKeys = Object.keys(nameTagData ?? {});

	const nameTagItems: { data: StatItem[]; key: string }[] = useMemo(
		() =>
			nameTagKeys.map(nKey => ({
				key: nKey,
				data: nameTagData?.[nKey]
					? [
							...Object.keys(nameTagData?.[nKey]).map(key => ({
								key,
								label: key,
								value: nameTagData[nKey][key],
							})),
					  ]
					: [],
			})),
		[nameTagData, nameTagKeys],
	);

	const [searchParams, setSearchParams] = useSearchParams();

	const handleUpdateFilter = useCallback(
		(type: string) => (key: string) => {
			//TODO: riesi ked je nejaky model nieco/nieco
			if (type === 'models' && key.split('/').length > 1) {
				const keyArr = key.split('/');
				keyArr.forEach(k => searchParams.append(type, k));
				setSearchParams(searchParams);
			} else {
				searchParams.append(type, key);
				setSearchParams(searchParams);
			}
		},
		[searchParams, setSearchParams],
	);

	//TODO: add to handleUpdateFilter
	const handleUpdateNameTag =
		(nameTag: keyof AvailableNameTagFilters) =>
		(value: string, operation?: 'EQUAL' | 'NOT_EQUAL') => {
			const ntquery = `${NameTagCode[NameTagCodeFilter[nameTag]]}`;
			searchParams.append(
				'NT',
				`${ntquery}${OperationCode[operation ?? 'EQUAL']}${value}`,
			);
			setSearchParams(searchParams);
		};

	const handleChangeFilter = useCallback(
		(type: string) => (key: string) => {
			searchParams.set(type, key);
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
				<MyAccordion label="Dostupnost" isExpanded isLoading={isLoading}>
					{onRefresh => (
						<StatList
							items={avalItems}
							onClick={handleChangeFilter('availability')}
							refresh={onRefresh}
						/>
					)}
				</MyAccordion>
			)}
			<MyAccordion label="Obohacen??" isExpanded isLoading={isLoading}>
				{onRefresh => (
					<StatList
						items={enrichedItems}
						onClick={handleChangeFilter('enrichment')}
						refresh={onRefresh}
					/>
				)}
			</MyAccordion>
			{modelItems.length > 0 && (
				<MyAccordion label="Typ dokumentu" isExpanded isLoading={isLoading}>
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
				<MyAccordion label="Kl????ov?? slovo" isExpanded isLoading={isLoading}>
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
				<MyAccordion label="Autor" isExpanded isLoading={isLoading}>
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
				<MyAccordion label="Jazyk" isLoading={isLoading}>
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

			<MyAccordion label="Rok vyd??n??" isExpanded isLoading={isLoading}>
				<PublishDateFilter />
			</MyAccordion>
			<MyAccordion
				label={
					<Flex alignItems="center">
						<MdBolt size={18} />
						<H4>NameTag</H4>
					</Flex>
				}
				isExpanded
				isLoading={isLoading}
			>
				<NameTagFilter />
			</MyAccordion>
			{nameTagItems.map(nti =>
				nti.data.length > 0 ? (
					<MyAccordion key={nti.key} label={nti.key} isLoading={isLoading}>
						{onRefresh => (
							<StatList
								items={nti.data}
								maxRows={3}
								refresh={onRefresh}
								customDialog
								onClick={handleUpdateNameTag(
									nti.key as keyof AvailableNameTagFilters,
								)}
							/>
						)}
					</MyAccordion>
				) : (
					<></>
				),
			)}
			<Box height="50px" />
		</Box>
	);
};

export default React.memo(SearchResultLeftPanel, (prevProps, nextProps) =>
	isEqual(prevProps, nextProps),
);

//export default SearchResultLeftPanel;
