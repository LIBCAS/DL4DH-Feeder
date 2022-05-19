/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import styled from '@emotion/styled/macro';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { parse, stringify } from 'query-string';
import { isEqual } from 'lodash-es';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import MyAccordion from 'components/accordion';
import Button from 'components/styled/Button';
import LoaderSpin from 'components/loaders/LoaderSpin';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';

import { AvailableFilters, ModelsEnum } from 'api/models';

import { modelToText } from 'utils/enumsMap';

import ActiveFilters from './ActiveFilters';

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
	onClick?: (key: string) => void;
}> = ({ items, maxRows, refresh, onClick }) => {
	const [exp, setExp] = useState<boolean>(!maxRows);
	const theme = useTheme();

	return (
		<>
			{(maxRows && !exp ? items.slice(0, maxRows) : items).map((item, i) => (
				<Flex
					key={item.label + i}
					justifyContent="space-between"
					alignItems="center"
					fontWeight={item.bold ? 'bold' : 'unset'}
					fontSize="13px"
					onClick={() => {
						onClick?.(item.key);
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
					<Cell maxWidth={200}>{item.label}</Cell>
					<Text> {item.value}</Text>
				</Flex>
			))}
			{!exp ? (
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
					{maxRows && (
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
							label: key,
							value: data.languages[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.languages],
	);

	const [searchParams, setSearchParams] = useSearchParams();

	const handleUpdateFilter = useCallback(
		(type: string) => (key: string) => {
			//TODO: riesi ked je nejaky model nieco/nieco
			if (type === 'models' && key.split('/').length > 1) {
				const keyArr = key.split('/');
				console.log('keyArr');
				console.log(keyArr);
				keyArr.forEach(k => searchParams.append(type, k));
				setSearchParams(searchParams);
			} else {
				searchParams.append(type, key);
				setSearchParams(searchParams);
			}
		},
		[searchParams, setSearchParams],
	);
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
			<MyAccordion label="Dostupnost" isExpanded isLoading={isLoading}>
				<StatList
					items={avalItems}
					onClick={handleChangeFilter('availability')}
				/>
			</MyAccordion>
			<MyAccordion label="Typ dokumentu" isExpanded isLoading={isLoading}>
				<StatList items={modelItems} onClick={handleUpdateFilter('models')} />
			</MyAccordion>
			<MyAccordion label="Klíčové slovo" isExpanded isLoading={isLoading}>
				{onRefresh => (
					<StatList
						items={keywordsItems}
						maxRows={3}
						refresh={onRefresh}
						onClick={handleUpdateFilter('keywords')}
					/>
				)}
			</MyAccordion>
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
			<MyAccordion label="Jazyk" isExpanded isLoading={isLoading}>
				{onRefresh => (
					<StatList
						items={languagesItems}
						maxRows={3}
						refresh={onRefresh}
						onClick={handleUpdateFilter('languages')}
					/>
				)}
			</MyAccordion>
		</Box>
	);
};

export default React.memo(SearchResultLeftPanel, (prevProps, nextProps) =>
	isEqual(prevProps, nextProps),
);

//export default SearchResultLeftPanel;
