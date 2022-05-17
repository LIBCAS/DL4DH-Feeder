/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { FC, useMemo, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import styled from '@emotion/styled/macro';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import MyAccordion from 'components/accordion';
import Button from 'components/styled/Button';
import LoaderSpin from 'components/loaders/LoaderSpin';

import { Loader } from 'modules/loader';

import { AvailableFilters } from 'api/models';

type StatItem = {
	label: string;
	value: number;
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
}> = ({ items, maxRows, refresh }) => {
	const [exp, setExp] = useState<boolean>(!maxRows);
	return (
		<>
			{(maxRows && !exp ? items.slice(0, maxRows) : items).map((item, i) => (
				<Flex
					key={item.label + i}
					justifyContent="space-between"
					fontWeight={item.bold ? 'bold' : 'unset'}
					fontSize="13px"
					lineHeight={1}
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

const SearchResultLeftPanel: FC<Props> = ({ data }) => {
	const avalItems: StatItem[] = useMemo(
		() => [
			{
				label: 'Pouze veřejné',
				value: data?.availability.public ?? 0,
			},
			{
				label: 'Pouze neveřejné',
				value: data?.availability.private ?? 0,
			},
			{
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
							label: key,
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
							label: key,
							value: data.languages[key],
						})),
				  ].sort((a, b) => b.value - a.value)
				: [],
		[data?.languages],
	);

	return (
		<Box px={2} width={1}>
			<MyAccordion label="Dostupnost" isExpanded>
				<StatList items={avalItems} />
			</MyAccordion>
			<MyAccordion label="Typ dokumentu" isExpanded>
				<StatList items={modelItems} />
			</MyAccordion>
			<MyAccordion label="Klíčové slovo" isExpanded>
				{onRefresh => (
					<StatList items={keywordsItems} maxRows={3} refresh={onRefresh} />
				)}
			</MyAccordion>
			<MyAccordion label="Autor" isExpanded>
				{onRefresh => (
					<StatList items={authorsItems} maxRows={3} refresh={onRefresh} />
				)}
			</MyAccordion>
			<MyAccordion label="Jazyk" isExpanded>
				{onRefresh => (
					<StatList items={languagesItems} maxRows={3} refresh={onRefresh} />
				)}
			</MyAccordion>
			{/* <MyAccordion label="Klíčové slovo">
				{onRefresh => (
					<StatList
						items={[...DocItems, ...DocItems]}
						maxRows={3}
						refresh={onRefresh}
					/>
				)}
			</MyAccordion>
			<MyAccordion label="Klíčové slovo">
				{onRefresh => (
					<StatList
						items={[...DocItems, ...DocItems]}
						maxRows={3}
						refresh={onRefresh}
					/>
				)}
			</MyAccordion>
			<MyAccordion label="Dostupnost">
				<StatList items={AvalItems} />
			</MyAccordion>
			<Box>Rok vydani</Box> */}
		</Box>
	);
};

const SearchResultLeftPanelTest: FC = () => {
	console.log('panel rerender');
	return (
		<Box px={2} width={1} key={'cicicici'}>
			{/* <MyAccordion label="Dostupnost" isExpanded>
					<Text>ahoj</Text>
					<Text>ahoj</Text>
					<Text>ahoj</Text>
					<Text>ahoj</Text>
					<Text>ahoj</Text>
					<Text>ahoj</Text>
					<Text>ahoj</Text>
					<Text>ahoj</Text>
				</MyAccordion> */}
		</Box>
	);
};

export default React.memo(SearchResultLeftPanel, () => true);
