import { MdClose, MdWarning } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { FC } from 'react';

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
			color="white"
			px={3}
			textShadow="1px 1px 1px rgba(0,0,0,0.3)"
			justifyContent="space-between"
		>
			<Flex alignItems="center">
				<MdWarning />
				<Text ml={2}>
					<b>Upozornění:</b> Je aktivován filtr z historie dotazů. Počet
					výsledků se od uložení filtru{' '}
					{currentCount !== data.numFound ? (
						<>
							{' '}
							<b>změnil</b>. Aktuální počet: <b>{currentCount}</b>. Počet z
							historie: <b> {data.numFound}</b>
						</>
					) : (
						<>
							<b>nezměnil.</b>
						</>
					)}
				</Text>
			</Flex>
			<Flex flexShrink={0}>
				<IconButton
					minWidth={20}
					width={20}
					mr={3}
					color="white"
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
