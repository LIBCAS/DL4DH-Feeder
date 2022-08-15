/** @jsxImportSource @emotion/react */
import { FC, useRef } from 'react';

import { Flex } from 'components/styled';

import ZoomifyView from 'modules/zoomify/ZoomifyView';

type Props = {
	page: string;
	pageOfSecond?: string;
};

const PubMainDetail: FC<Props> = ({ page, pageOfSecond }) => {
	const zoomRef = useRef<HTMLDivElement | null>(null);

	return (
		<Flex
			id="ZOOMIFY_PARRENT_EL"
			ref={zoomRef}
			width={1}
			bg="border"
			alignItems="center"
			position="relative"
		>
			<ZoomifyView id={page} isMultiView={!!pageOfSecond} />
			{pageOfSecond && (
				<ZoomifyView id={pageOfSecond} isSecond isMultiView={!!pageOfSecond} />
			)}
		</Flex>
	);
};

export default PubMainDetail;
