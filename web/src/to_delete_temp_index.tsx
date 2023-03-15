import '@reach/dialog/styles.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useTranslation } from 'react-i18next';

import { TooltipContextProvider } from 'components/tooltip/TooltipCtx';
import { Metadata } from 'components/kramerius/model/metadata.model';

import { ThemeProvider } from 'theme';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';

import useMetadata, { useMetadataFormatter } from 'hooks/useMetadata';

import i18n from 'utils/localization';

import './index.css';

const queryCache = new QueryCache();
const queryClient = new QueryClient({
	queryCache,
	defaultOptions: {
		queries: { staleTime: Infinity, retry: 1, refetchOnWindowFocus: false },
	},
});

const mapTitle = {
	monograph: { label: 'kniha', key: 'title' },
	monographunit: { label: 'kniha zo zvazku', key: 'title' }, // tu treba cekovat aj partName a partNumber a potom dalsie titles v poli
	periodical: { label: 'periodikum', key: 'title' },
	periodicalvolume: { label: 'rocnik', key: 'partNumber' },
	periodicalitem: { label: 'cislo', key: 'partNumber' },
	page: { label: 'strana', key: 'partNumber' },
};

const getPublisherInfo = (m: Metadata) => m.publishers.map(p => p.fullDetail());
const getLocationInfo = (m: Metadata) =>
	m.locations.map(l => ({
		signature: l.shelfLocator,
		loc: l.physicalLocation,
	}));

const getPhysicalDescriptionString = (m: Metadata) =>
	m.physicalDescriptions.map(pd => (!pd.empty() ? `${pd.note}` : ''));

const Test: React.FC<{ id2: string }> = () => {
	const id = window.location.pathname.slice(1);
	const x = usePublicationChildren(id);
	const pub = usePublicationDetail(id);
	const { fcm, isLoading } = useMetadata(pub.data?.context);
	const { formatMetadata, getTitles, getPartsInfo } = useMetadataFormatter();
	useEffect(() => {
		i18n.changeLanguage('cz');
	}, []);

	//const y = useFullContextMetadata(x.data);
	// const ip = x.data?.filter(d => d.model === 'internalpart');
	// const pgs = x.data?.filter(d => d.model === 'page');
	if (x.isLoading || isLoading) {
		return <>LOADING</>;
	}
	const formatted = fcm.map(m => ({
		model: m.model,
		pid: m.pid,
		data: formatMetadata(m.metadata),
		titles: getTitles(m.metadata),
		parts: getPartsInfo(m.metadata, m.model),
		year: m.metadata.getYearRange(),
	}));
	console.log({ fcm });
	console.log({ formatted });

	// fcm.map(f => {
	// 	console.log('getShortTitleWithIssue', f.metadata.getShortTitleWithIssue());
	// 	console.log(
	// 		'getShortTitlwWithVolume',
	// 		f.metadata.getShortTitlwWithVolume(),
	// 	);
	// 	console.log('getYearRange', f.metadata.getYearRange());
	// });

	// fcm.map(f => {
	// 	console.log(
	// 		mapTitle[f.model]?.label ?? 'unknown',
	// 		f.metadata.titles?.[0]?.[mapTitle[f.model]?.key],
	// 	);
	// });
	// console.log(x.data?.[0].title);
	// console.log('iparts = ', ip?.length);
	// console.log('pgs = ', pgs?.length);
	return (
		<>
			<div>DONE</div>
			<hr />

			<div style={{ fontSize: '14px', overflow: 'auto!important' }}>
				<div>
					{formatted.map((f, index) => {
						return (
							<div key={index}>
								<div>
									{f.model} : {f.pid}
								</div>
								<h2>{f.titles?.mainTitle ?? ''}</h2>
								<h3>{f.titles?.mainSubTitle ?? ''}</h3>
								<h4>Dalsie nazvy</h4>
								<div>
									{f.titles?.otherTitles.map(
										ot => `${ot.mainTitle} / ${ot.subTitle}`,
									)}
								</div>
								<br />
								<br />
								<h2>
									{f.parts?.label ?? ''}:{f.parts?.mainPartName ?? ''}{' '}
									{f.parts?.mainPartNumber ?? ''}
								</h2>
								<h3></h3>
								<h4>Dalsie nazvy</h4>
								<div>
									{f.titles?.otherTitles.map(
										ot => `${ot.mainTitle} / ${ot.subTitle}`,
									)}
								</div>
								<br />
								<br />
								Rok: {f.year}
								<div>
									{f.data.map((field, index) => {
										return (
											<div key={`${field.id}-${index}`}>
												<div>
													{field.data
														.filter(d => d.value.length > 0)
														.map(d => {
															return (
																<div
																	key={`${field.id}-${index}-${d.label}-${d.value}`}
																>
																	{d.label}:
																	{d.link ? (
																		<>
																			{d.value.map((linkLabel, itemIndex) => (
																				<a
																					key={linkLabel}
																					href={d.getLink(itemIndex)}
																				>
																					<b>{linkLabel}</b>
																				</a>
																			))}
																		</>
																	) : (
																		<div>
																			{d.value.map((label, itemIndex) => (
																				<div
																					key={`not-link-${label}-${itemIndex}`}
																				>
																					<b>{label}</b>
																				</div>
																			))}
																		</div>
																	)}
																</div>
															);
														})}
												</div>
											</div>
										);
									})}
								</div>
								<hr />
							</div>
						);
					})}
				</div>
				{fcm.map((m, index) => {
					return (
						<div key={m.pid}>
							{index}.{m.model} <br />
							<br /> {mapTitle[m.model]?.label ?? 'unknown'}:{' '}
							<b>{m.metadata.titles?.[0]?.[mapTitle[m.model]?.key]}</b>
							<br />
							AUTORI:
							{m.metadata.authors.map(a => (
								<div key={a.name}>
									{' '}
									- {a.name}, {a.date}
								</div>
							))}
							<br />
							Publishers: {m.metadata.publishers.map(a => a.name)}
							<br />
							Publishers full: {getPublisherInfo(m.metadata)}
							<br />
							Publishers datum vydani: {m.metadata.publishers.map(a => a.date)}
							<br />
							<br />
							Keywords: {m.metadata.keywords.join(', ')}
							<br />
							Geo: {m.metadata.geonames.join(', ')}
							<br />
							Jazyk: {m.metadata.languages.join(', ')}
							<br />
							Misto ulozeni:{' '}
							{getLocationInfo(m.metadata).map(
								l => `${l.loc} - ${l.signature}`,
							)}
							Fyzicky pocit: {}
							<br />
							<br />
							<br />
							<hr />
							<br />
						</div>
					);
				})}
			</div>
		</>
	);
};
// povodne
// uuid:21426150-9e46-11dc-a259-000d606f5dc6

// uuid kapitoly
// uuid:10367700-a71c-11dc-9cac-000d606f5dc6

// kniha zo zvazku
// uuid:26895750-1c70-11e8-a0cf-005056827e52

// stranka zo zvazku, obsahuje aj partName a partNumber (parent - monounit)

// zlozitejsie periodikum
// uuid:de7d7b20-4e02-11ed-a50c-005056825209

// publikacia ktora ma internalpart - zacykli sa nachvilu
// http://localhost:3000/view/uuid:21426150-9e46-11dc-a259-000d606f5dc6?page=uuid:a9759e30-42d6-4a91-846f-4b636b4066ed
// internal part je vraci childrenov
//http://localhost:3000/search?query=D%C4%9Bjepis%20pro%20ml%C3%A1de%C5%BE%20%C4%8Deskoslovanskou%20na%20%C5%A1kol%C3%A1ch%20n%C3%A1rodn%C3%ADch&availability=PUBLIC

ReactDOM.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<TooltipContextProvider>
				<Test id2="uuid:26895750-1c70-11e8-a0cf-005056827e52" />
			</TooltipContextProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
