import { FC, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Accordion from 'components/accordion';
import { Flex } from 'components/styled';
import { H4 } from 'components/styled/Text';
import StatList, { StatItem } from 'components/filters/Accordions/StatList';

import { nameTagQueryCtor } from 'utils';

import { AvailableNameTagFilters, TagNameEnum } from 'api/models';

import {
	CUSTOM_URL_PARAMS,
	NameTagFilterToNameTagEnum,
	NameTagIcon,
} from 'utils/enumsMap';

export const NameTagList: FC<{ nameTagData?: AvailableNameTagFilters }> = ({
	nameTagData,
}) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { t } = useTranslation('nametag');

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
				searchParams.delete(CUSTOM_URL_PARAMS.HISTORY_ID);
				setSearchParams(searchParams);
			},
		[setSearchParams, searchParams],
	);

	return (
		<>
			{nameTagItems.map((nti, index) => {
				const formattedKey = NameTagFilterToNameTagEnum[nti.key];
				const Icon = NameTagIcon[formattedKey as TagNameEnum];
				return nti.data.length > 0 ? (
					<Accordion
						key={`${nti.key}-${index}`}
						label={
							<Flex alignItems="center">
								<Icon size={14} />
								<H4 ml={2}>{t(`labels.${formattedKey}`)}</H4>
							</Flex>
						}
						isLoading={false}
						storeKey={formattedKey}
					>
						{onRefresh => (
							<StatList
								listId={t(`labels.${formattedKey}`)}
								items={nti.data}
								maxRows={3}
								refresh={onRefresh}
								customDialog
								onClick={handleUpdateNameTag(
									nti.key as keyof AvailableNameTagFilters,
								)}
							/>
						)}
					</Accordion>
				) : (
					<></>
				);
			})}
		</>
	);
};

export default NameTagList;
