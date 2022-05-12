export default {
	NotFound: () => import('modules/notFound'),
	Authorize: () => import('modules/public/auth'),

	// Public
	Homepage: () => import('modules/public/homepage'),
	MainSearch: () => import('modules/public/mainSearch'),
	PublicationView: () => import('modules/publication/detail'),
};
