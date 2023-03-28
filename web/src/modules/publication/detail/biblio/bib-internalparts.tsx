import { FC, useMemo, useState } from 'react';
import { MdOutlineMore, MdClose } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import Button, { NavLinkButton } from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import Text, { H5 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ModalDialog from 'components/modal';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';

import { useParseUrlIdsAndParams } from 'modules/publication/publicationUtils';
import { Loader } from 'modules/loader';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';
import { PublicationChild, PublicationContext } from 'api/models';

import { useMultiviewContext } from 'hooks/useMultiviewContext';

const getParentPid = (context: PublicationContext[], pid?: string) => {
	if (!pid || pid === '') {
		return undefined;
	}
	const currentIndex = context.flat().findIndex(c => c.pid === pid);
	if (currentIndex < 0 || currentIndex - 1 < 0) {
		return undefined;
	}
	return context.flat()?.[currentIndex - 1]?.pid ?? undefined;
};

export const useInternalParts = () => {
	const { sidePanel } = useMultiviewContext();
	const { getApropriateIds, formatViewLink } = useParseUrlIdsAndParams();
	const { id } = getApropriateIds(sidePanel === 'right');
	const currentDetail = usePublicationDetail(id);
	const isInternalPart = currentDetail.data?.model === 'internalpart';
	const parentId = getParentPid(currentDetail.data?.context ?? [], id);

	const response = usePublicationChildren(isInternalPart ? parentId : id);
	const children = useMemo(
		() => response?.data?.filter(ch => ch.model === 'internalpart'),
		[response?.data],
	);

	const parent = parentId
		? {
				id: parentId,
				link: formatViewLink(parentId, sidePanel === 'right'),
		  }
		: undefined;

	return {
		id,
		parent,
		loading: response.isLoading || currentDetail.isLoading,
		hasInternalParts: children && children?.length > 0,
		children,
		formatLink: (uuid: string) => formatViewLink(uuid, sidePanel === 'right'),
	};
};

export const BibInternalPartsList: FC<{
	ipList: PublicationChild[];
	activeId?: string;
	formatLink: (id: string) => string;
}> = ({ ipList, activeId, formatLink }) => {
	return (
		<Wrapper>
			<Divider />

			{ipList?.map(ch => (
				<Box key={ch.pid}>
					<NavLinkButton
						color="text"
						fontWeight={ch.pid === activeId ? 'bold' : 'normal'}
						disabled={ch.pid === activeId}
						fontSize="md"
						variant="text"
						textAlign="left"
						to={formatLink(ch.pid)}
					>
						{ch.title}
					</NavLinkButton>

					<Divider />
				</Box>
			))}
		</Wrapper>
	);
};

export const BibInternalPartsDialog: FC = () => {
	const { loading, hasInternalParts, children, formatLink, id, parent } =
		useInternalParts();

	if (loading) {
		return <Loader />;
	}

	if (!hasInternalParts) {
		return <></>;
	}
	return (
		<ModalDialog
			label="Chapters"
			control={openModal => (
				<IconButton
					onClick={openModal}
					color="#9e9e9e"
					tooltip="Zvolit jinou kapitolu"
				>
					<MdOutlineMore size={18} />
				</IconButton>
			)}
		>
			{closeModal => (
				<Paper>
					{parent && (
						<Box>
							<NavLinkButton
								color="text"
								fontSize="md"
								variant="text"
								textAlign="left"
								fontWeight="bold"
								to={parent.link}
							>
								Přejít na celou publikaci
							</NavLinkButton>
						</Box>
					)}
					<Flex width={1} justifyContent="space-between" alignItems="center">
						<H5 my={2}>Zvolit jinou kapitolu</H5>
						<IconButton color="primary" onClick={closeModal}>
							<MdClose size={20} />
						</IconButton>
					</Flex>
					<BibInternalPartsList
						ipList={children ?? []}
						activeId={id}
						formatLink={formatLink}
					/>
				</Paper>
			)}
		</ModalDialog>
	);
};

const BibInternalParts: FC = () => {
	const [open, setOpen] = useState(false);
	const { loading, hasInternalParts, children, formatLink, id, parent } =
		useInternalParts();

	if (loading) {
		return <Loader />;
	}

	if (!hasInternalParts) {
		return <></>;
	}

	return (
		<Wrapper p={3}>
			{parent && (
				<Box>
					<NavLinkButton
						color="text"
						fontSize="md"
						variant="text"
						textAlign="left"
						fontWeight="bold"
						to={parent.link}
					>
						Přejít na celou publikaci
					</NavLinkButton>
				</Box>
			)}
			<Button variant="primary" onClick={() => setOpen(p => !p)}>
				{open ? 'Skrýt kapitoly' : 'Zobrazit kapitoly'}
			</Button>

			{open && (
				<Wrapper>
					<Text color="#616161" fontSize="16.5px" fontWeight="bold">
						Kapitoly
					</Text>

					<BibInternalPartsList
						ipList={children ?? []}
						formatLink={formatLink}
						activeId={id}
					/>
				</Wrapper>
			)}
		</Wrapper>
	);
};

export default BibInternalParts;
