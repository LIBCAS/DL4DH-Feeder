import { FC, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdLock } from 'react-icons/md';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import ZoomifyView from 'modules/zoomify/ZoomifyView';

import { MultiviewContextProvider } from 'hooks/useMultiviewContext';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { usePublicationContext } from '../ctx/pub-ctx';

import PubPageNotFound from './PubPageNotFound';

type Props = {
	page: string;
	pageOfSecond?: string;
	leftPublic?: boolean;
	rightPublic?: boolean;
};

const PriavatePublicationInfo: FC<{ isMultiView?: boolean }> = ({
	isMultiView,
}) => {
	const { t } = useTranslation();

	return (
		<Flex
			width={isMultiView ? '50%' : '100%'}
			p={4}
			alignItems="center"
			justifyContent="center"
			fontWeight="bold"
			fontSize="xl"
			height={`calc(100vh - ${INIT_HEADER_HEIGHT}px)`}
		>
			<Flex
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
				mt={-100}
			>
				<MdLock size={60} />
				<Text>{t('licence:private_label')}</Text>
			</Flex>
		</Flex>
	);
};

const PubMainDetail: FC<Props> = ({
	page,
	pageOfSecond,
	leftPublic,
	rightPublic,
}) => {
	const zoomRef = useRef<HTMLDivElement | null>(null);
	const [sp] = useSearchParams();
	const pctx = usePublicationContext();
	const fulltext1 = sp.get('fulltext');
	const pageUrl1 = sp.get('page');
	const fulltext2 = sp.get('fulltext2');
	const pageUrl2 = sp.get('page2');

	return (
		<Flex
			id="ZOOMIFY_PARRENT_EL"
			ref={zoomRef}
			width={1}
			bg="border"
			alignItems="center"
			position="relative"
		>
			<MultiviewContextProvider initSidePanel="left">
				{fulltext1 && !pageUrl1 && !pctx.isLoadingLeft ? (
					<PubPageNotFound multiview={!!pageOfSecond} />
				) : (
					<>
						{leftPublic ? (
							<ZoomifyView id={page} />
						) : (
							<PriavatePublicationInfo isMultiView={!!pageOfSecond} />
						)}
					</>
				)}
			</MultiviewContextProvider>
			{pageOfSecond && (
				<MultiviewContextProvider initSidePanel="right">
					{fulltext2 && !pageUrl2 && !pctx.isLoadingRight ? (
						<PubPageNotFound isSecond multiview={!!pageOfSecond} />
					) : (
						<>
							{rightPublic ? (
								<ZoomifyView id={pageOfSecond} />
							) : (
								<PriavatePublicationInfo isMultiView={!!pageOfSecond} />
							)}
						</>
					)}
				</MultiviewContextProvider>
			)}
		</Flex>
	);
};

export default PubMainDetail;
