/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from '@emotion/core';
import { MdLock } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { formatForUuidHeap } from 'modules/export/BulkExportAdditionalButtons';
import { usePublicationContext2 } from 'modules/publication/ctx/pubContext';

import { SelectedOverlayCss, useTheme } from 'theme';

import { PublicationChild } from 'api/models';

import { useBulkExportContext } from 'hooks/useBulkExport';

type Props = {
	child: PublicationChild;
	onSelect?: (uuid: string) => void;
	tileWrapperCss?: (uuid: string) => SerializedStyles;
};
const PeriodicalTileItem: React.FC<Props> = ({
	child,
	onSelect,
	tileWrapperCss,
}) => {
	const nav = useNavigate();
	const { exportModeOn, uuidHeap, updateExportHeap } = useBulkExportContext();
	const pctx = usePublicationContext2();
	const { t } = useTranslation('periodical');

	const isMonograph = child.model === 'monographunit';
	const isPeriodical = child.model.includes('periodical'); //TODO:FIXME: check child node
	const url = `/${isPeriodical ? 'periodical' : 'view'}/${child.pid}`;
	const isSelected = exportModeOn && uuidHeap[child.pid]?.selected;
	const theme = useTheme();
	const handleAddToExport = useCallback(() => {
		const selected = !(uuidHeap[child.pid]?.selected ?? false);
		const parent = pctx?.publicationChildren?.find(ch => ch.pid === child.pid);
		const title = parent?.title ? parent?.title : parent?.root_title;

		updateExportHeap?.(p => ({
			...p,
			[child.pid]: formatForUuidHeap('child', child, selected, title),
		}));
	}, [child, pctx?.publicationChildren, updateExportHeap, uuidHeap]);

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
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				position="relative"
				px={1}
				m={1}
				maxWidth={120}
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
					&:hover {
						box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.5);
						cursor: pointer;
					}
					${tileWrapperCss?.(child.pid) ?? ``}
				`}
			>
				<Flex
					fontSize="md"
					color="primary"
					flexDirection="column"
					alignItems="center"
				>
					{child.details?.year && (
						<Text mb={2} color="primary" fontWeight="bold">
							{child.details.year}
						</Text>
					)}

					{child.details?.date && (
						<Text mb={2} color="primary" fontWeight="bold">
							{child.details.date}
						</Text>
					)}

					{child.details?.title && (
						<Text mb={2} color="primary" fontWeight="bold">
							{child.details.title}
						</Text>
					)}
				</Flex>
				<Flex
					width={isMonograph ? '200px' : '95px'}
					height={140}
					justifyContent="center"
					alignItems="center"
					color="text"
					position="relative"
					p={1}
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
				<Flex
					flexDirection="column"
					width={1}
					alignItems="center"
					color={child.enriched ? 'black' : 'textCommon'}
				>
					{child.details?.pagenumber !== null && (
						<Text
							css={css`
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
							`}
						>
							{child.details?.pagenumber}
						</Text>
					)}
					{child.details?.volumeNumber && (
						<Text
							css={css`
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
							`}
						>
							{t('periodicalvolume', { part: child.details?.volumeNumber })}
						</Text>
					)}
					{child.details?.partNumber && (
						<Text
							css={css`
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
								max-width: 100%;
							`}
						>
							{t('periodicalitem', { part: child.details?.partNumber })}
						</Text>
					)}
				</Flex>
			</Flex>
		</a>
	);
};
export default PeriodicalTileItem;
