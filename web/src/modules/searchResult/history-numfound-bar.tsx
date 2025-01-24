import { MdClose, MdWarning } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { FC } from 'react';
import { Trans } from 'react-i18next';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';

import { useSearchHistoryDetail } from 'api/historyApi';

import { CUSTOM_URL_PARAMS } from 'utils/enumsMap';

const HistoryNumFoundBar: FC<{
	currentCount: number;
	resultsLoading: boolean;
}> = ({ currentCount, resultsLoading }) => {
	const [sp, setSp] = useSearchParams();
	const id = sp.get(CUSTOM_URL_PARAMS.HISTORY_ID);
	const { data, isLoading, isError } = useSearchHistoryDetail(id);

	const numFoundEmpty =
		data?.numFound === undefined ||
		data.numFound === null ||
		isNaN(data.numFound);

	if (resultsLoading || isLoading || !id || !data || isError || numFoundEmpty) {
		if (isError) {
			sp.delete(CUSTOM_URL_PARAMS.HISTORY_ID);
			setSp(sp);
		}

		return <></>;
	}

	return (
		<Flex
			bg="enriched"
			height={30}
			position="sticky"
			top={0}
			alignItems="center"
			color="black"
			px={3}
			justifyContent="space-between"
		>
			<Flex alignItems="center">
				<MdWarning />
				<Text ml={2}>
					<Trans i18nKey="search_history:info_msg_count" />
					{currentCount !== data.numFound ? (
						<Trans
							i18nKey="search_history:info_msg_count_changed"
							values={{ currentCount, historyCount: data.numFound }}
						/>
					) : (
						<Trans i18nKey="search_history:info_msg_count_unchanged" />
					)}
				</Text>
			</Flex>
			<Flex flexShrink={0}>
				<IconButton
					minWidth={20}
					width={20}
					mr={3}
					color="black"
					onClick={() => {
						sp.delete(CUSTOM_URL_PARAMS.HISTORY_ID);
						setSp(sp);
					}}
				>
					<MdClose size={22} />
				</IconButton>
			</Flex>
		</Flex>
	);
};

export default HistoryNumFoundBar;
