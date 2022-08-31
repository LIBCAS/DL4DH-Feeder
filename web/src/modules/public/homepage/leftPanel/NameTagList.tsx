import { FC, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import MyAccordion from 'components/accordion';
import { Flex } from 'components/styled';
import { H4 } from 'components/styled/Text';
import StatList, { StatItem } from 'components/filters/Accordions/StatList';

import { nameTagQueryCtor } from 'utils';

import { AvailableNameTagFilters, TagNameEnum } from 'api/models';

import {
	NameTagFilterToNameTagEnum,
	NameTagIcon,
	NameTagToText,
} from 'utils/enumsMap';

export const NameTagList: FC<{ nameTagData?: AvailableNameTagFilters }> = ({
	nameTagData,
}) => {
	const [searchParams, setSearchParams] = useSearchParams();

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

	const handleUpdateNameTag = useCallback(
		(nameTag: keyof AvailableNameTagFilters) =>
			(value: string, operation?: 'EQUAL' | 'NOT_EQUAL') => {
				const nameTagQuery = nameTagQueryCtor(nameTag, operation, value);
				if (nameTagQuery) {
					searchParams.append(nameTagQuery.name, nameTagQuery.value);
				}
				searchParams.delete('page');
				setSearchParams(searchParams);
			},
		[setSearchParams, searchParams],
	);

	return (
		<>
			{nameTagItems.map(nti => {
				const formattedKey = NameTagFilterToNameTagEnum[nti.key];
				const Icon = NameTagIcon[formattedKey as TagNameEnum];
				return nti.data.length > 0 ? (
					<MyAccordion
						key={nti.key}
						label={
							<Flex alignItems="center">
								<Icon size={14} />
								<H4 ml={2}>{NameTagToText[formattedKey]}</H4>
							</Flex>
						}
						isLoading={false}
						storeKey={formattedKey}
					>
						{onRefresh => (
							<StatList
								listId={NameTagToText[formattedKey]}
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
				);
			})}
		</>
	);
};

export default NameTagList;
