import { useNavigate, useParams } from 'react-router-dom';

import { Loader } from 'modules/loader';
import NotFound from 'modules/notFound';

import { usePublicationDetail } from 'api/publicationsApi';

const RouteUuid: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const pub = usePublicationDetail(id ?? '');
	const nav = useNavigate();
	console.log({ pub });
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
