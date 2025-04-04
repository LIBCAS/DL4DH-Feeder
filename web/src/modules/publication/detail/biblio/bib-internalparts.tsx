import { FC, useMemo, useState } from 'react';
import { MdOutlineMore, MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

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
	const { getApropriateIds, formatViewLink } = useParseUrlIdsAndParams();
	const { id } = getApropriateIds();
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
				link: formatViewLink(parentId),
		  }
		: undefined;

	return {
		id,
		parent,
		loading: response.isLoading || currentDetail.isLoading,
		hasInternalParts: children && children?.length > 0,
		children,
		formatLink: (uuid: string) => formatViewLink(uuid),
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

	const { t } = useTranslation('bibliography');

	if (loading) {
		return <Loader />;
	}

	if (!hasInternalParts) {
		return <></>;
	}
	return (
		<ModalDialog
			label=""
			control={openModal => (
				<Flex>
					<IconButton
						onClick={openModal}
						color="#9e9e9e"
						tooltip={t('internal_parts_choose_different')}
					>
						<MdOutlineMore size={18} />
					</IconButton>
					{parent && (
						<Box>
							<NavLinkButton
								color="text"
								fontSize="sm"
								variant="text"
								textAlign="left"
								fontWeight="bold"
								to={parent.link}
							>
								{t('internal_parts_parent')}
							</NavLinkButton>
						</Box>
					)}
				</Flex>
			)}
		>
			{closeModal => (
				<Paper>
					<Flex width={1} justifyContent="space-between" alignItems="center">
						<H5 my={2}>{t('internal_parts_choose_different')}</H5>
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

const BibInternalParts: FC = ({ children }) => {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation('bibliography');
	const {
		loading,
		hasInternalParts,
		children: internalPartsChildren,
		formatLink,
		id,
		parent,
	} = useInternalParts();

	if (loading) {
		return <Loader />;
	}

	if (!hasInternalParts) {
		return <>{children}</>;
	}

	return (
		<Wrapper>
			<Flex width={1} my={2} px={2} position="relative">
				<Button
					mx={1}
					width={1 / 2.2}
					variant={open ? 'outlined' : 'primary'}
					onClick={() => setOpen(false)}
				>
					{t('pages')}
				</Button>
				<Button
					mx={1}
					width={1 / 2.2}
					variant={!open ? 'outlined' : 'primary'}
					onClick={() => setOpen(true)}
				>
					{t('show_chapters')}
				</Button>
			</Flex>

			{open ? (
				<Wrapper px={2}>
					<Text color="#616161" fontSize="16.5px" fontWeight="bold">
						{t('chapters')}
					</Text>

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
								{t('internal_parts_parent')}
							</NavLinkButton>
						</Box>
					)}

					<BibInternalPartsList
						ipList={internalPartsChildren ?? []}
						formatLink={formatLink}
						activeId={id}
					/>
				</Wrapper>
			) : (
				<>{children}</>
			)}
		</Wrapper>
	);
};

export default BibInternalParts;
