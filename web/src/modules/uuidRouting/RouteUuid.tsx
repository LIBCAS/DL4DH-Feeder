import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from 'modules/loader';
import NotFound from 'modules/notFound';

import { usePublicationDetail } from 'api/publicationsApi';
import { PublicationDetail } from 'api/models';

export const useRouteUuid = (uuid?: string, item?: PublicationDetail) => {
	const nav = useNavigate();
	if (!item || !uuid) {
		return;
	}
	const ictx = item?.context?.flat(1);
	//TODO: docTypes - zistit ake su presne moznosti, tieto su z krameria klienta a nevyzera to aktualne
	const docType = item.model;
	if (docType === 'page') {
		const parentUuid = ictx[ictx.length - 2]?.pid;
		nav({ pathname: '/view/' + parentUuid, search: 'page=' + uuid });
	} else if (docType === 'article') {
		const parentUuid = ictx[ictx.length - 2]?.pid;
		nav({ pathname: '/view/' + parentUuid, search: 'article=' + uuid });
	} else if (
		docType === 'periodical' ||
		docType === 'periodicalvolume' ||
		docType === 'convolute'
	) {
		nav({ pathname: '/periodical/' + uuid });
	} else if (docType === 'soundunit' || docType === 'soundrecording') {
		nav({ pathname: '/music/' + uuid });
	} else if (docType === 'collection') {
		nav({ pathname: '/collection/' + uuid });
	} else {
		nav({ pathname: '/view/' + uuid });
	}
};

const RouteUuid: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const pub = usePublicationDetail(id ?? '');
	const nav = useNavigate();

	if (pub.isLoading) {
		return <Loader />;
	}

	const item = pub.data;

	if (!item) {
		return <NotFound />;
	}
	const ictx = item?.context?.flat(1);
	//TODO: docTypes - zistit ake su presne moznosti, tieto su z krameria klienta a nevyzera to aktualne
	const docType = item.model;
	if (docType === 'page') {
		const parentUuid = ictx[ictx.length - 2]?.pid;
		nav({ pathname: '/view/' + parentUuid, search: 'page=' + id });
	} else if (docType === 'article') {
		const parentUuid = ictx[ictx.length - 2]?.pid;
		nav({ pathname: '/view/' + parentUuid, search: 'article=' + id });
	} else if (
		docType === 'periodical' ||
		docType === 'periodicalvolume' ||
		docType === 'convolute'
	) {
		nav({ pathname: '/periodical/' + id });
	} else if (docType === 'soundunit' || docType === 'soundrecording') {
		nav({ pathname: '/music/' + id });
	} else if (docType === 'collection') {
		nav({ pathname: '/collection/' + id });
	} else {
		nav({ pathname: '/view/' + id });
	}

	return <Loader />;
};

export default RouteUuid;
