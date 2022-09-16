import { FC, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Flex } from 'components/styled';

import ZoomifyView from 'modules/zoomify/ZoomifyView';

import PubPageNotFound from './PubPageNotFound';

type Props = {
	page: string;
	pageOfSecond?: string;
};

const PubMainDetail: FC<Props> = ({ page, pageOfSecond }) => {
	const zoomRef = useRef<HTMLDivElement | null>(null);
	const [sp] = useSearchParams();
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
			{fulltext1 && !pageUrl1 ? (
				<PubPageNotFound multiview={!!pageOfSecond} />
			) : (
				<ZoomifyView id={page} isMultiView={!!pageOfSecond} />
			)}
			{pageOfSecond && (
				<>
					{fulltext2 && !pageUrl2 ? (
						<PubPageNotFound isSecond multiview={!!pageOfSecond} />
					) : (
						<ZoomifyView
							id={pageOfSecond}
							isSecond
							isMultiView={!!pageOfSecond}
						/>
					)}
				</>
			)}
		</Flex>
	);
};

export default PubMainDetail;
