/** @jsxImportSource @emotion/react */
import { FC, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Flex } from 'components/styled';

import ZoomifyView from 'modules/zoomify/ZoomifyView';
import { Loader } from 'modules/loader';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

type Props = {
	page: string;
};

const PubMainDetail: FC<Props> = ({ page }) => {
	const zoomRef = useRef<HTMLDivElement | null>(null);
	const [sp, setSp] = useSearchParams();
	const multiview = sp.get('secondPublication');

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
			{multiview && <SeconZoomify id={multiview} />}
		</Flex>
	);
};

const SeconZoomify: FC<{ id: string }> = ({ id }) => {
	const response = usePublicationChildren(id);

	if (response.isLoading) {
		return <Loader />;
	}

	return <ZoomifyView id={response.data?.[0]?.pid ?? ''} isSecond />;
};

export default PubMainDetail;
