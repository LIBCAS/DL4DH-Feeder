/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { FC, useContext, useMemo, useRef, useState } from 'react';
import { MdCode, MdCopyAll, MdExpandMore } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import XMLViewer from 'react-xml-viewer';
import ReactJson from 'react-json-view';

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

import { PubCtx } from '../ctx/pub-ctx';

const ViewStream = React.forwardRef<
	HTMLDivElement,
	{
		uuid: string;
		stream: StreamTypeEnum;
		mime: string;
	}
>(({ uuid, stream, mime }, ref) => {
	const response = useStreams(uuid, stream, mime);
	const pageDetail = usePublicationDetail(uuid ?? '');
	const childrenDetail = usePublicationChildren(uuid ?? '');
	if (response.isLoading || pageDetail.isLoading || childrenDetail.isLoading) {
		return <LoaderSpin />;
	}
	console.log({ response });

	return (
		<div ref={ref}>
			{stream === 'TEXT_OCR' ? (
				<Text>
					<pre>{response.data}</pre>
				</Text>
			) : (
				<>
					{stream === 'ITEM' || stream === 'CHILDREN' ? (
						<ReactJson
							src={
								stream === 'ITEM'
									? pageDetail.data ?? {}
									: childrenDetail.data ?? {}
							}
							shouldCollapse={false}
							displayDataTypes={false}
							displayObjectSize={false}
							enableClipboard={false}
						/>
					) : (
						<>
							{response.data ? (
								<XMLViewer xml={response.data} />
							) : (
								'Neobsahuje' + stream
							)}
						</>
					)}
				</>
			)}
		</div>
	);
});

ViewStream.displayName = ViewStream.name;

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

const MetaStreamsDialog: FC = () => {
	const { publication } = useContext(PubCtx);
	const [searchParams] = useSearchParams();
	const pageId = searchParams.get('page');
	const pageSource = { pid: pageId ?? 'undefined', model: 'PAGE' };
	const pubContext = publication?.context ?? [];
	const sources = [...pubContext, pageSource];

	const [selectedMod, setSelectedMod] = useState<StreamInfoDto | null>(
		itemStream,
	);
	const ref = useRef<HTMLDivElement>(null);
	const ref2 = useRef<HTMLDivElement>(null);
	const copyRef = useRef<HTMLDivElement>(null);

	const [source, setSource] = useState<PublicationContext>(pageSource);
	const theme = useTheme();
	const allStreams = useStreamList(source.pid);

	console.log({ ctx: publication?.context });

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
				s => s.key?.toUpperCase() === selectedMod?.key?.toUpperCase(),
			),
		[streamsOptions, selectedMod],
	);

	if (allStreams.isLoading) {
		return <LoaderSpin />;
	}

	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<IconButton color="primary" onClick={openModal} p={1}>
					<MdCode size={24} />
				</IconButton>
			)}
		>
			{closeModal => (
				<Paper minHeight="50vh" bg="paper">
					<Flex
						mb={3}
						justifyContent="space-between"
						alignItems="flex-start"
						overflow="visible"
					>
						<Flex>
							<SimpleSelect
								options={streamsOptions}
								onChange={item => setSelectedMod(item)}
								nameFromOption={item => item?.key ?? ''}
								keyFromOption={item => item?.key ?? ''}
								value={selectedMod}
								variant="underlined"
								minWidth="150px"
							/>

							<Tabs
								tabs={[
									...(publication?.context ?? []).map(c => ({
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
									{
										key: 'PAGE',
										jsx: (
											<Button fontSize="lg" color="inherit" variant="text">
												Stránka
											</Button>
										),
									},
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
								activeTab={source.model.toUpperCase()}
								setActiveTab={k =>
									setSource(
										sources.find(s => s.model.toUpperCase() === k) ??
											pageSource,
									)
								}
							/>
						</Flex>
						<Button
							className="clpbtn"
							variant="text"
							onClick={() => {
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
							<ViewStream
								ref={ref2}
								uuid={source.pid}
								stream={selectedMod?.key ?? 'ITEM'}
								mime={selectedMod?.mimeType ?? 'text/plain'}
							/>
						) : (
							<Text>
								Stream <b>{selectedMod?.key ?? '--'}</b> není pro{' '}
								<b>{ModelToText[source.model]}</b> dostupný.
							</Text>
						)}
					</Flex>
					<Flex>
						<Button variant="primary" onClick={closeModal} my={3}>
							Zavřít
						</Button>
					</Flex>
				</Paper>
			)}
		</ModalDialog>
	);
};

export default MetaStreamsDialog;
