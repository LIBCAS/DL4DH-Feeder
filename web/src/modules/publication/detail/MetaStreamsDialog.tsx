/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { FC, useMemo, useRef, useState } from 'react';
import { MdCode, MdCopyAll, MdExpandMore } from 'react-icons/md';
import { useParams, useSearchParams } from 'react-router-dom';
import XMLViewer from 'react-xml-viewer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import SimpleSelect from 'components/form/select/SimpleSelect';
import LoaderSpin from 'components/loaders/LoaderSpin';
import ModalDialog from 'components/modal';
import { Box, Flex } from 'components/styled';
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

const ViewStream: FC<{
	uuid: string;
	stream: StreamTypeEnum;
	mime: string;
	contentRef: React.MutableRefObject<string>;
}> = ({ uuid, stream, mime, contentRef }) => {
	const response = useStreams(uuid, stream, mime);
	if (response.isLoading) {
		return <LoaderSpin />;
	}
	contentRef.current = response.data ?? '';

	//TODO: IMG_FULL_ADM => niekedy vracia obrazok... pozor mrzne to
	//TODO: napr http://localhost:3000/view/uuid:93d73550-7099-11e5-99af-005056827e52?page=uuid%3A2f66a5f0-766c-11e5-83b9-5ef3fc9bb22f
	//TEXT_OCR_ADM => niekedy je OCR a niekedy XML
	return (
		<Flex overflow="auto" width={1} p={2}>
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
		</Flex>
	);
};

const ViewJSON: FC<{
	uuid: string;
	stream: 'ITEM' | 'CHILDREN';
	contentRef: React.MutableRefObject<string>;
}> = ({ uuid, stream, contentRef }) => {
	const pageDetail = usePublicationDetail(uuid ?? '');
	const childrenDetail = usePublicationChildren(uuid ?? '');
	const dataArr = useMemo(() => {
		if (stream === 'CHILDREN') {
			const childrenString = JSON.stringify(
				childrenDetail.data ?? {},
				null,
				10,
			);
			contentRef.current = childrenString;
			return childrenString.split('\n');
		} else if (stream === 'ITEM') {
			const itemString = JSON.stringify(pageDetail.data ?? {}, null, 10);
			contentRef.current = itemString;
			return itemString.split('\n');
		}
		return [] as string[];
	}, [childrenDetail.data, pageDetail.data, contentRef, stream]);

	if (pageDetail.isLoading || childrenDetail.isLoading) {
		return <LoaderSpin />;
	}

	const ITEM_HEIGHT = 30;
	const maxWidth = Math.max(...dataArr.map(c => c.length)) * 7;

	return (
		<Flex
			flexDirection="column"
			alignItems="flex-top"
			css={css`
				position: absolute;
				top: 0;
				width: 100%;
				height: 100%;
				overflow: hidden !important;
			`}
		>
			<AutoSizer>
				{({ width, height }) => (
					<FixedSizeList
						itemCount={dataArr.length}
						width={width}
						height={height}
						itemSize={ITEM_HEIGHT}
						style={{ overflow: 'auto' }}
					>
						{({ index, style }) => (
							<Box
								p={0}
								m={0}
								height={ITEM_HEIGHT}
								style={{ ...style }}
								minWidth={maxWidth}
							>
								<SyntaxHighlighter
									language="json"
									customStyle={{
										background: 'transparent!important',
										overflow: 'hidden',
									}}
								>
									{dataArr[index]}
								</SyntaxHighlighter>
							</Box>
						)}
					</FixedSizeList>
				)}
			</AutoSizer>
		</Flex>
	);
};

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
	const copyRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<string>('');

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
		<Paper bg="paper" px={2} py={2}>
			<Flex
				mb={1}
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
						wrapperCss={css`
							height: 30px;
						`}
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
					my={0}
					py={0}
					onClick={() => {
						//TODO: vyzaduje https spojenie, skryt/upozornit ked neni https?
						//navigator.clipboard.writeText(ref2.current?.innerText ?? '');
						navigator.clipboard.writeText(contentRef.current ?? '');
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
				maxHeight="60vh"
				height="60vh"
				minHeight="300px"
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
								stream={selectedStream.key}
								contentRef={contentRef}
							/>
						) : (
							<ViewStream
								uuid={source?.pid ?? 'stream_undefined'}
								stream={selectedStream?.key ?? 'DC'}
								mime={selectedStream?.mimeType ?? 'text/plain'}
								contentRef={contentRef}
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
			<Flex width={1} justifyContent="flex-end">
				<Button variant="primary" onClick={closeModal} mt={2}>
					Zavřít
				</Button>
			</Flex>
		</Paper>
	);
};

const MetaStreamsDialog: FC<{ rootId: string; pageId: string }> = ({
	rootId,
	pageId,
}) => {
	const [searchParams] = useSearchParams();
	//const pageId = searchParams.get('page');
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
