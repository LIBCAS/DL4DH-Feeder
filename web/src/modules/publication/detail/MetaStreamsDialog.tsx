/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { FC, useMemo, useRef, useState } from 'react';
import { MdCode, MdCopyAll, MdExpandMore } from 'react-icons/md';
import { useParams, useSearchParams } from 'react-router-dom';
import XMLViewer from 'react-xml-viewer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import SimpleSelect from 'components/form/select/SimpleSelect';
import LoaderSpin from 'components/loaders/LoaderSpin';
import ModalDialog from 'components/modal';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import Text from 'components/styled/Text';
import Tabs from 'components/tabs';
import IconButton from 'components/styled/IconButton';

import { useTheme } from 'theme';

import {
	StreamInfoDto,
	usePublicationChildren,
	usePublicationDetail,
	useStreamList,
	useStreams,
} from 'api/publicationsApi';
import { PublicationContext, StreamTypeEnum } from 'api/models';

import { ModelToText } from 'utils/enumsMap';

const ViewStream = React.forwardRef<
	HTMLDivElement,
	{
		uuid: string;
		stream: StreamTypeEnum;
		mime: string;
	}
>(({ uuid, stream, mime }, ref) => {
	const response = useStreams(uuid, stream, mime);
	if (response.isLoading) {
		return <LoaderSpin />;
	}

	return (
		<div ref={ref}>
			{stream === 'TEXT_OCR' ? (
				<Text>
					<pre>{response.data}</pre>
				</Text>
			) : (
				<>
					{response.data ? (
						<XMLViewer xml={response.data} />
					) : (
						'Neobsahuje' + stream
					)}
				</>
			)}
		</div>
	);
});

ViewStream.displayName = ViewStream.name;

const ViewJSON = React.forwardRef<
	HTMLDivElement,
	{
		uuid: string;
		stream: 'ITEM' | 'CHILDREN';
	}
>(({ uuid, stream }, ref) => {
	const pageDetail = usePublicationDetail(uuid ?? '');
	const childrenDetail = usePublicationChildren(uuid ?? '');
	if (pageDetail.isLoading || childrenDetail.isLoading) {
		return <LoaderSpin />;
	}
	return (
		<div ref={ref}>
			<SyntaxHighlighter
				//TODO: Use WINDOW to render
				language="json"
				customStyle={{ background: 'transparent!important' }}
			>
				{JSON.stringify(
					stream === 'ITEM'
						? pageDetail.data ?? '{}'
						: childrenDetail.data ?? '{}',
					null,
					10,
				)}
			</SyntaxHighlighter>
		</div>
	);
});

ViewJSON.displayName = ViewJSON.name;

const itemStream = {
	key: 'ITEM',
	mimeType: 'json',
	label: 'item',
} as StreamInfoDto;
const childrenStream = {
	key: 'CHILDREN',
	mimeType: 'json',
	label: 'children',
} as StreamInfoDto;

type StreamsViewerProps = {
	closeModal: () => void;
	sources: PublicationContext[];
};

const StreamsViewer: FC<StreamsViewerProps> = ({ closeModal, sources }) => {
	const [selectedStream, setSelectedStream] = useState<StreamInfoDto | null>(
		itemStream,
	);
	const ref = useRef<HTMLDivElement>(null);
	const ref2 = useRef<HTMLDivElement>(null);
	const copyRef = useRef<HTMLDivElement>(null);

	const [source, setSource] = useState<PublicationContext>(sources[0]);
	const theme = useTheme();
	const allStreams = useStreamList(source?.pid ?? '');

	const streamsOptions = useMemo(
		() => [
			itemStream,
			childrenStream,
			...allStreams.list.filter(
				s => !s.mimeType.toUpperCase().includes('IMAGE'),
			),
		],
		[allStreams],
	);

	const isValidStream = useMemo(
		() =>
			streamsOptions.some(
				s => s.key?.toUpperCase() === selectedStream?.key?.toUpperCase(),
			),
		[streamsOptions, selectedStream],
	);

	if (allStreams.isLoading) {
		return (
			<Paper minHeight="50vh" bg="paper">
				<LoaderSpin />
			</Paper>
		);
	}

	return (
		<Paper /* minHeight="70vh" */ bg="paper">
			<Flex
				mb={3}
				justifyContent="space-between"
				alignItems="flex-start"
				overflow="visible"
			>
				<Flex flexDirection={['column', 'row']}>
					<SimpleSelect
						options={streamsOptions}
						onChange={item => setSelectedStream(item)}
						nameFromOption={item => item?.key ?? ''}
						keyFromOption={item => item?.key ?? ''}
						value={selectedStream}
						variant="underlined"
						minWidth="150px"
					/>

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
									>
										{ModelToText[c.model]}
									</Button>
								),
							})),
							/* {
										key: 'PAGE',
										jsx: (
											<Button fontSize="lg" color="inherit" variant="text">
												Stránka
											</Button>
										),
									}, */
						]}
						tabsDivider={
							<Flex alignItems="center" color="inactive">
								<MdExpandMore
									size={20}
									css={css`
										transform: rotate(-90deg);
									`}
								/>
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
				<Button
					className="clpbtn"
					variant="text"
					onClick={() => {
						//TODO: vyzaduje https spojenie, skryt/upozornit ked neni https?
						navigator.clipboard.writeText(ref2.current?.innerText ?? '');
					}}
					title="Kopírovat do schránky"
					onMouseEnter={() => {
						if (ref?.current) {
							ref.current.style.backgroundColor = 'rgba(0,0,0,0.1)';
						}
						if (copyRef?.current) {
							copyRef.current.style.visibility = 'visible';
						}
					}}
					onMouseLeave={() => {
						if (ref?.current) {
							ref.current.style.backgroundColor = 'white';
						}
						if (copyRef?.current) {
							copyRef.current.style.visibility = 'hidden';
						}
					}}
					css={css`
						&:hover {
							color: black;
						}
					`}
				>
					<Flex ref={copyRef}>
						<Text mx={2} fontSize="lg">
							Kopírovat do schránky
						</Text>
					</Flex>
					<MdCopyAll size={26} />
				</Button>
			</Flex>
			<Flex
				ref={ref}
				position="relative"
				overflow="scroll"
				maxHeight="60vh"
				minHeight="300px"
				px={2}
				css={css`
					border: 1px solid ${theme.colors.border};
				`}
			>
				{isValidStream ? (
					<>
						{selectedStream?.key === 'ITEM' ||
						selectedStream?.key === 'CHILDREN' ? (
							<ViewJSON
								uuid={source?.pid ?? 'json_undefined'}
								ref={ref2}
								stream={selectedStream.key}
							/>
						) : (
							<ViewStream
								ref={ref2}
								uuid={source?.pid ?? 'stream_undefined'}
								stream={selectedStream?.key ?? 'DC'}
								mime={selectedStream?.mimeType ?? 'text/plain'}
							/>
						)}
					</>
				) : (
					<Text>
						Stream <b>{selectedStream?.key ?? '--'}</b> není pro{' '}
						<b>{ModelToText[source?.model ?? '']}</b> dostupný.
					</Text>
				)}
			</Flex>
			<Flex>
				<Button variant="primary" onClick={closeModal} my={3}>
					Zavřít
				</Button>
			</Flex>
		</Paper>
	);
};

const MetaStreamsDialog = () => {
	const { id: rootId } = useParams<{ id: string }>();
	const [searchParams] = useSearchParams();
	const pageId = searchParams.get('page');
	const rootDetailResponse = usePublicationDetail(
		pageId ?? rootId ?? 'pageId_rootId_undefined',
	);
	const rootDetail = rootDetailResponse.data ?? null;

	if (rootDetailResponse.isLoading || !rootDetail) {
		return <LoaderSpin />;
	}

	const rootContext = rootDetail?.context?.flat() ?? [];

	return (
		<ModalDialog
			label="Info"
			customCss={() => css`
				min-width: 80vw;
				padding: 0;
			`}
			control={openModal => (
				<IconButton color="primary" onClick={openModal}>
					<MdCode size={24} />
				</IconButton>
			)}
		>
			{closeModal => (
				<StreamsViewer closeModal={closeModal} sources={rootContext} />
			)}
		</ModalDialog>
	);
};

export default MetaStreamsDialog;
