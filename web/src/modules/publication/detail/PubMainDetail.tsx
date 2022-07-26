/** @jsxImportSource @emotion/react */
import { FC, useRef } from 'react';

import { Flex } from 'components/styled';

import ZoomifyView from 'modules/zoomify/ZoomifyView';

type Props = {
	page: string;
};

const PubMainDetail: FC<Props> = ({ page }) => {
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
			<ZoomifyView id={page} />
		</Flex>
	);
};

export default PubMainDetail;
