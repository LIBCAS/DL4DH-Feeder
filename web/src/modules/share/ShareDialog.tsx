/** @jsxImportSource @emotion/react */
import { FC, useEffect, useMemo, useState } from 'react';
import { MdClose, MdCopyAll, MdShare } from 'react-icons/md';
import { css } from '@emotion/core';

import ModalDialog from 'components/modal';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Tabs from 'components/tabs';
import Text from 'components/styled/Text';
import LoaderSpin from 'components/loaders/LoaderSpin';
import Divider from 'components/styled/Divider';

import { usePublicationContext } from 'modules/publication/ctx/pub-ctx';

import { PublicationContext } from 'api/models';
import { usePublicationDetail } from 'api/publicationsApi';

import { ModelToText } from 'utils/enumsMap';

type Props = {
	isSecond?: boolean;
};

//TODO:
// skontrolovat sharovanie tohto periodika, porovnat s ndk, ked sharujem rocnik tak to blbne
//http://localhost:3000/periodical/uuid:a3499e99-8120-465b-81d4-8d87717708e5
// resp nefunguje tam routing spravne
//https://ndk.cz/periodical/uuid:a3499e99-8120-465b-81d4-8d87717708e5
const ShareDialog: FC<Props> = ({ isSecond }) => {
	const pctx = usePublicationContext();
	const currentPagePid = isSecond
		? pctx.currentPageOfSecond?.uuid ?? undefined
		: pctx.currentPage?.uuid ?? undefined;
	const pubPid = isSecond ? pctx.secondPublication?.pid : pctx.publication?.pid;
	const rootDetailResponse = usePublicationDetail(
		currentPagePid ?? pubPid ?? 'pageId_rootId_undefined',
	);
	const rootDetail = rootDetailResponse.data ?? null;

	const [source, setSource] = useState<PublicationContext | undefined>();
	const rootContext = useMemo(
		() => (rootDetail?.context?.flat() ?? []).reverse(),
		[rootDetail],
	);

	useEffect(() => {
		setSource(rootContext[0]);
	}, [rootContext]);

	if (rootDetailResponse.isLoading || !rootDetail) {
		return <LoaderSpin size={20} />;
	}

	const sources = rootContext?.flat() ?? [];

	const link = `${window.location.origin}/uuid/${source?.pid ?? 'undefined'}`;

	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<IconButton color="primary" onClick={openModal} tooltip="Sdílet">
					<MdShare size={24} />
				</IconButton>
			)}
		>
			{closeModal => (
				<Paper>
					<Flex alignItems="center" justifyContent="space-between">
						<Flex alignItems="center">
							<Text fontWeight="bold" my={0} mr={1}>
								Sdílet :
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

					<Text mt={4}>Odkaz pro sdílení</Text>
					<Flex alignItems="center" justifyContent="space-between">
						<Text color="black">{link}</Text>

						<Button
							className="clpbtn"
							variant="text"
							my={0}
							py={0}
							onClick={() => {
								navigator.clipboard.writeText(link ?? '');
							}}
							title="Kopírovat do schránky"
							css={css`
								&:hover {
									color: black;
								}
							`}
						>
							<Flex>
								<Text mx={2}>Kopírovat do schránky</Text>
							</Flex>
							<MdCopyAll size={26} />
						</Button>
					</Flex>
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

export default ShareDialog;
