/** @jsxImportSource @emotion/react */
import { FC, useEffect, useMemo, useState } from 'react';
import { MdClose, MdCopyAll, MdFormatQuote, MdShare } from 'react-icons/md';
import { css } from '@emotion/core';
import { useTranslation } from 'react-i18next';

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
import { KRAMERIUS_ENUMS } from 'components/kramerius/enums/kenums';

import { usePublicationContext } from 'modules/publication/ctx/pub-ctx';

import { PublicationContext } from 'api/models';
import { usePublicationDetail, useStreams } from 'api/publicationsApi';

import { ModelToText } from 'utils/enumsMap';

type Props = {
	isSecond?: boolean;
};

const ShowQuotation: FC<{ uuid: string; pageId: string }> = ({
	uuid,
	pageId,
}) => {
	const { data, isLoading } = useStreams(uuid, 'BIBLIO_MODS');
	const [metadata, setMetadata] = useState<Metadata | undefined>();
	const { data: pageTitle } = usePublicationDetail(pageId);

	useEffect(() => {
		if (!isLoading && data) {
			const pservice = new ModsParserService();
			const metadata = pservice.parse(data, uuid);
			setMetadata(metadata);
		}
	}, [data, isLoading, uuid]);
	// const x = metadata?.getPrimaryAuthors();
	// console.log(metadata?.getTitle());
	// console.log(metadata?.getCollectionTitle('cs'));

	return (
		<Text as="span" fontSize="14px">
			{metadata?.authors.map(a => a.name)}.{' '}
			<Text as="span" fontStyle="italic">
				{metadata?.getTitle()}
			</Text>
			.{metadata?.publishers[0].fullDetail()} s. {pageTitle?.title}.{' '}
		</Text>
	);
};

const QuotationDialog: FC<Props> = ({ isSecond }) => {
	const pctx = usePublicationContext();
	const { t } = useTranslation();
	const currentPagePid = isSecond
		? pctx.currentPageOfSecond?.uuid ?? undefined
		: pctx.currentPage?.uuid ?? undefined;
	const pubPid = isSecond ? pctx.secondPublication?.pid : pctx.publication?.pid;
	const rootDetailResponse = usePublicationDetail(
		currentPagePid ?? pubPid ?? 'pageId_rootId_undefined',
	);
	const rootDetail = rootDetailResponse.data ?? null;

	const [source, setSource] = useState<PublicationContext | undefined>();
	const { data: currentTitle } = usePublicationDetail(
		source?.pid ?? 'sourceId_undefined',
		!source?.pid,
	);

	const rootContext = useMemo(
		() => (rootDetail?.context?.flat() ?? []).reverse(),
		[rootDetail],
	);

	useEffect(() => {
		setSource(rootContext[0]);
	}, [rootContext]);

	if (rootDetailResponse.isLoading || !rootDetail) {
		return <LoaderSpin />;
	}

	const sources = rootContext?.flat() ?? [];

	const link = `${window.location.origin}/uuid/${source?.pid ?? 'undefined'}`;

	//console.log({ rootDetail, currentTitle });

	return (
		<ModalDialog
			label="Info"
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
												{ModelToText[c.model]}
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
						<ShowQuotation
							uuid={pctx.publication?.root_pid ?? ''}
							pageId={currentPagePid ?? ''}
						/>
						<Text as="span">
							{t('share:available_from')}: {link}
						</Text>
					</Text>
					<Divider my={3} />
					<Flex justifyContent="flex-end">
						<Button variant="text" fontSize="lg" onClick={closeModal}>
							Zavřít
						</Button>
					</Flex>
				</Paper>
			)}
		</ModalDialog>
	);
};

export default QuotationDialog;
