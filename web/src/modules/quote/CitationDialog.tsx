import { FC, useEffect, useMemo, useState } from 'react';
import { MdClose, MdFormatQuote } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

import ModalDialog from 'components/modal';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Tabs from 'components/tabs';
import Text from 'components/styled/Text';
import LoaderSpin from 'components/loaders/LoaderSpin';
import Divider from 'components/styled/Divider';
import { Metadata } from 'components/kramerius/model/metadata.model';
import { ModsParserService } from 'components/kramerius/modsParser/modsParserService';

import { Loader } from 'modules/loader';
import { useParseUrlIdsAndParams } from 'modules/publication/publicationUtils';

import { api } from 'api';

import { ModelsEnum, PublicationContext } from 'api/models';
import { usePublicationDetail } from 'api/publicationsApi';

import { modelToText } from 'utils/enumsMap';

// TODO: use useFullContextMetadata from hook in useMetadata
// fix http://localhost:3000/view/uuid:21426150-9e46-11dc-a259-000d606f5dc6?page=uuid%3Abdc7b117-1078-4a27-b7e4-abd12e788142

const useFullContextMetadata = (context: PublicationContext[]) => {
	const [metadata, setMetadata] = useState<Record<string, Metadata>>({});
	const [parsed, setParsed] = useState(false);
	const mqueries = useQueries(
		context.map(ctx => ({
			queryKey: ['stream-with-parse', ctx.pid, 'BIBLIO_MODS'],
			queryFn: async () => {
				const mod = await api()
					.get(`item/${ctx.pid}/streams/BIBLIO_MODS`, {
						headers: { accept: 'application/json' },
					})
					.then(async r => await r.text());

				return { pid: ctx.pid, model: ctx.model, mods: mod };
			},
		})),
	);

	const isLoading = useMemo(() => mqueries.some(q => q.isLoading), [mqueries]);

	useEffect(() => {
		if (!isLoading && !parsed) {
			const metadata: Record<string, Metadata> = {};
			//console.log('parsing');
			mqueries.forEach(({ data }) => {
				if (data) {
					const pservice = new ModsParserService();
					const parsed = pservice.parse(data.mods, data.pid);
					metadata[data.model] = parsed;
				}
			});
			setMetadata(metadata);
			setParsed(true);
		}
	}, [isLoading, mqueries, parsed]);

	return { metadata, isLoading };
};

const getPartsInfoText = (
	currentSource: string,
	metadata: Record<string, Metadata>,
	pubContext: PublicationContext[],
) => {
	const result: (string | JSX.Element)[] = [];
	const sourceIndex = pubContext.findIndex(pc => pc.model === currentSource);

	const volumeNumber =
		metadata['periodicalvolume']?.titles?.[0]?.partNumber ?? '';
	const issueNumber = metadata['periodicalitem']?.titles?.[0]?.partNumber ?? '';
	const monographPartNumber =
		metadata['monographunit']?.titles?.[0]?.partNumber ??
		metadata['monographunit']?.titles?.[1]?.partNumber ??
		'';

	const monographPartName =
		metadata['monographunit']?.titles?.[0]?.partName ??
		metadata['monographunit']?.titles?.[1]?.partName ??
		'';

	let index = sourceIndex;
	while (index < pubContext.length) {
		const parrentMetadata = metadata[pubContext[index].model];
		const author = parrentMetadata?.authors?.[0]?.name ?? '';

		if (author) {
			result.push(`${author.toUpperCase()}. `);
			break;
		}
		index++;
	}

	index = 0;
	while (index < pubContext.length) {
		const parrentMetadata = metadata[pubContext[index].model];
		const title =
			parrentMetadata?.getTitle?.() ??
			//parrentMetadata?.titles?.[0]?.title() ??
			undefined;

		if (
			title &&
			pubContext[index].model !== 'internalpart' &&
			pubContext[index].model !== 'supplement'
		) {
			result.push(<i>{title}. </i>);
			break;
		}
		index++;
	}

	index = sourceIndex;
	while (index < pubContext.length) {
		const parrentMetadata = metadata[pubContext[index].model];
		const detail = parrentMetadata?.publishers?.[0]?.fullDetail?.();

		if (detail) {
			result.push(detail);
			break;
		}
		index++;
	}

	if (
		currentSource === 'page' ||
		currentSource === 'periodicalitem' ||
		currentSource === 'monographunit'
	) {
		if (metadata['periodical']) {
			result.push(`, ${volumeNumber} (${issueNumber})`);
		}
		if (metadata['monographunit']) {
			result.push(`, sv. ${monographPartNumber}`);
			result.push(`, ${monographPartName}`);
		}
	}

	if (currentSource === 'periodicalvolume') {
		result.push(`, ${volumeNumber}`);
	}

	return result;
};

const ShowCitation: FC<{
	uuid: string;
	pageId: string;
	pubContext: PublicationContext[];
	currentSource: string;
}> = ({ pageId, currentSource, pubContext }) => {
	const { data: pageTitle } = usePublicationDetail(pageId);
	const fullMetadata = useFullContextMetadata(pubContext.flat());

	const pageInfo =
		currentSource === 'page' ? `. s ${pageTitle?.title ?? '?'}.` : '. ';

	if (fullMetadata.isLoading) {
		return <Loader />;
	}
	return (
		<Text as="span" fontSize="14px" p={1}>
			{getPartsInfoText(currentSource, fullMetadata.metadata, pubContext)}
			{pageInfo}{' '}
		</Text>
	);
};

const CitationDialog = () => {
	const { getApropriateIds } = useParseUrlIdsAndParams();
	const { pageId, id: pubPid } = getApropriateIds();
	const { t } = useTranslation();

	const rootDetailResponse = usePublicationDetail(
		pageId ?? pubPid ?? 'pageId_rootId_undefined',
	);
	const rootDetail = rootDetailResponse.data ?? null;

	const [source, setSource] = useState<PublicationContext | undefined>();
	const [isMonographBundle, setIsMonohraphBundle] = useState(false);

	const rootContext = useMemo(() => {
		const ctx = rootDetail?.context?.flat() ?? [];
		const filtered: PublicationContext[] = [];

		ctx.forEach(c => {
			if (filtered.findIndex(f => f.model === c.model) === -1) {
				filtered.push(c);
			}
		});

		return filtered.reverse();
	}, [rootDetail]);

	useEffect(() => {
		setSource(rootContext[0]);
	}, [rootContext]);
	useEffect(() => {
		if (rootContext.find(rc => rc.model === 'monographunit')) {
			setIsMonohraphBundle(true);
		}
	}, [rootContext]);

	if (rootDetailResponse.isLoading || !rootDetail) {
		return <LoaderSpin size={20} />;
	}

	const sources = rootContext?.flat() ?? [];

	const link = `${window.location.origin}/uuid/${source?.pid ?? 'undefined'}`;

	return (
		<ModalDialog
			label=""
			control={openModal => (
				<IconButton
					color="primary"
					onClick={openModal}
					tooltip={t('book_controls:tooltip_citation')}
				>
					<MdFormatQuote size={24} />
				</IconButton>
			)}
		>
			{closeModal => (
				<Paper>
					<Flex alignItems="center" justifyContent="space-between">
						<Flex alignItems="center">
							<Text my={0} mr={1}>
								<Text as="span" color="primary">
									{t('citation-dialog:title')}
								</Text>{' '}
								<Text as="span" color="text" fontSize="12px">
									(ČSN ISO 690) |
								</Text>
							</Text>
							<Tabs
								tabs={[
									...(sources ?? []).map(c => ({
										key: c.model.toUpperCase(),
										jsx: (
											<Button
												fontSize="lg"
												color="inherit"
												variant="text"
												key={c.pid}
												mx={0}
												px={1}
												my={0}
												py={0}
											>
												{isMonographBundle ? (
													<>
														{c.model === 'monograph' ? (
															<>{t(`model_2p:monographbundle`)}</>
														) : (
															<>
																{t(
																	`model_2p:${modelToText(
																		c.model as ModelsEnum,
																	)}`,
																)}
															</>
														)}
													</>
												) : (
													<>
														{t(
															`model_2p:${modelToText(c.model as ModelsEnum)}`,
														)}
													</>
												)}
											</Button>
										),
									})),
								]}
								tabsDivider={
									<Flex alignItems="center" color="inactive" mx={1}>
										|
									</Flex>
								}
								activeTab={source?.model?.toUpperCase() ?? ''}
								setActiveTab={k =>
									setSource(
										(sources ?? []).find(s => s?.model?.toUpperCase() === k) ??
											sources[0],
									)
								}
							/>
						</Flex>
						<IconButton color="primary" onClick={closeModal}>
							<MdClose size={32} />
						</IconButton>
					</Flex>
					<Text color="black">
						<ShowCitation
							uuid={rootDetail.root_pid ?? ''}
							pageId={pageId ?? ''}
							pubContext={sources}
							currentSource={source?.model ?? ''}
						/>
						<Text as="span">
							{t('share:available_from')}: {link}
						</Text>
					</Text>
					<Divider my={3} />
					<Flex justifyContent="flex-end">
						<Button variant="text" fontSize="lg" onClick={closeModal}>
							{t('common:close')}
						</Button>
					</Flex>
				</Paper>
			)}
		</ModalDialog>
	);
};

export default CitationDialog;
