/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import MyAccordion from 'components/accordion';
import Button from 'components/styled/Button';

type StatItem = {
	label: string;
	value: number;
	bold?: boolean;
};

const AvalItems: StatItem[] = [
	{ label: 'Pouze verejne', value: 49636 },
	{ label: 'Pouze neverejne', value: 199689 },
	{ label: 'Vse', value: 249930, bold: true },
];

const DocItems: StatItem[] = [
	{ label: 'Knihovna', value: 21636 },
	{ label: 'Novinky a casopisy', value: 2039 },
	{ label: 'Mapa', value: 1394 },
	{ label: 'Grafika', value: 648 },
	{ label: 'Archivalie', value: 383 },
	{ label: 'Rukopis', value: 122 },
];

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
				>
					<Text>{item.label}</Text>
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

const SearchResultLeftPanel = () => {
	return (
		<Box px={2} width={1}>
			<MyAccordion label="Dostupnost" isExpanded>
				<StatList items={AvalItems} />
			</MyAccordion>
			<MyAccordion label="Typ dokumentů" isExpanded>
				<StatList items={AvalItems} />
			</MyAccordion>
			<MyAccordion label="Klíčové slovo" isExpanded>
				{onRefresh => (
					<StatList
						items={[...DocItems, ...DocItems]}
						maxRows={3}
						refresh={onRefresh}
					/>
				)}
			</MyAccordion>
			<MyAccordion label="Dostupnost" isExpanded>
				<StatList items={AvalItems} />
			</MyAccordion>
		</Box>
	);
};

export default SearchResultLeftPanel;
