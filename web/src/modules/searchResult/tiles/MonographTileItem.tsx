/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { MdLock } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { formatForUuidHeap } from 'modules/export/BulkExportAdditionalButtons';
import { usePublicationContext2 } from 'modules/publication/ctx/pubContext';

import { SelectedOverlayCss, useTheme } from 'theme';

import { ModelsEnum, PublicationChild } from 'api/models';

import { useBulkExportContext } from 'hooks/useBulkExport';

import { PubModelTagBadge } from './GenericTileItem';

const getTitle = (details: PublicationChild['details']): string => {
	let t = details.title ?? '';
	if (details.nonSort) {
		t = details.nonSort + ' ' + details.title;
	}
	if (details.subTitle) {
		t += ': ' + details.subTitle;
	}
	if (details.partNumber) {
		t += ', ' + details.partNumber;
	}
	if (details.partName) {
		t += ': ' + details.partName;
	}
	return t;
};

type Props = {
	child: PublicationChild;
	onSelect?: (uuid: string) => void;
};
const MonographTileItem: React.FC<Props> = ({ child, onSelect }) => {
	const nav = useNavigate();
	const isPeriodical = child.model.includes('periodical');
	const { exportModeOn, uuidHeap, updateExportHeap } = useBulkExportContext();
	const { t } = useTranslation('search');
	const pctx = usePublicationContext2();
	const url = `/${isPeriodical ? 'periodical' : 'view'}/${child.pid}`;
	const theme = useTheme();
	const title = getTitle(child.details);
	const handleAddToExport = useCallback(() => {
		const selected = !(uuidHeap[child.pid]?.selected ?? false);
		updateExportHeap?.(p => ({
			...p,
			[child.pid]: formatForUuidHeap(
				'child',
				child,
				selected,
				pctx?.publicationChildren?.find(ch => ch.pid === child.pid)?.title,
			),
		}));
	}, [child, updateExportHeap, uuidHeap, pctx]);

	const isSelected = exportModeOn && uuidHeap[child.pid]?.selected;

	return (
		<a
			key={child.pid}
			href={url}
			onClick={e => {
				e.preventDefault();
				if (exportModeOn) {
					handleAddToExport();
				} else if (onSelect) {
					onSelect(child.pid);
				} else {
					nav(url);
				}
			}}
			css={css`
				text-decoration: none;
			`}
		>
			<Flex
				bg={isSelected ? 'enrichedTransparent' : 'white'}
				flexDirection="row"
				alignItems="flex-start"
				justifyContent="flex-start"
				position="relative"
				p={2}
				css={css`
					${isSelected
						? css`
								border: 2px solid ${theme.colors.enriched};
								${SelectedOverlayCss}
						  `
						: css`
								border: 1px solid ${theme.colors.border};
						  `}
					box-sizing: border-box;
					width: 310px;
					height: 145px;
					max-width: 310px;
					max-height: 145px;
					&:hover {
						box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.5);
						cursor: pointer;
					}
				`}
			>
				<Flex
					justifyContent="center"
					alignItems="center"
					color="text"
					height="100%"
					width="90px"
					flexShrink={0}
					position="relative"
					css={css`
						border: 1px solid ${theme.colors.border};
						background-image: url(${`api/item/${child.pid}/thumb`});
						background-repeat: no-repeat;
						background-size: cover;
					`}
				>
					{child.policy === 'private' && (
						<Flex
							position="absolute"
							width="100%"
							height="100%"
							justifyContent="center"
							alignItems="center"
						>
							<Flex
								justifyContent="center"
								alignItems="center"
								position="relative"
								width="80px"
								height="80px"
								opacity={0.7}
								bg="white"
								css={css`
									border: 1px solid white;
									border-radius: 100%;
								`}
							>
								<MdLock size={50} />
							</Flex>
						</Flex>
					)}
				</Flex>
				<Flex px={2} flexDirection="column" height="100%" width={1}>
					<Flex
						fontSize="md"
						color="primary"
						flexDirection="column"
						alignItems="flex-start"
					>
						{title && (
							<Text mt={0} mb={2} color="primary" fontWeight="bold">
								{title}
							</Text>
						)}
					</Flex>
					<Flex flexGrow={1} />
					<Flex justifyContent="flex-end" alignItems="flex-end" width={1}>
						{child.enriched && (
							<Flex bg="primary" color="white" opacity="0.8" mr={2}>
								<Text py={1} my={0} px={3} fontSize="sm">
									{t('enrichment.is_enriched')}
								</Text>
							</Flex>
						)}
						<PubModelTagBadge model={child.model as ModelsEnum} />
					</Flex>
				</Flex>
			</Flex>
		</a>
	);
};
export default MonographTileItem;
