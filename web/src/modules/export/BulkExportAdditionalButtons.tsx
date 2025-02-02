import { useCallback, useMemo } from 'react';
import { MdClear, MdPlaylistAddCheck } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';

import UserRequestBulkDialog from 'modules/userRequests/bulk-operation/UserRequestBulkDialog';

import { PublicationChild, PublicationDto } from 'api/models';

import { useBulkExportContext, UuidHeapObject } from 'hooks/useBulkExport';
import { useSearchResultContext } from 'hooks/useSearchResultContext';

import BulkExportDialog from './BulkExportDialog';

type Props = {
	periodicalChildren?: PublicationChild[];
};

const constructChildTitle = (c: PublicationChild): string => {
	return `${c.details?.title ?? ''} ${c.details?.year ?? ''} ${
		c.details?.partName ?? ''
	} ${c.details?.partNumber ?? ''}`;
};

export const formatForUuidHeap = (
	variant: 'child' | 'publication',
	data: PublicationChild | PublicationDto,
	selected: boolean,
	parrentTitle?: string,
): UuidHeapObject => {
	if (variant === 'publication') {
		return {
			title: data.title,
			enriched: data.enriched,
			policy: data.policy ?? (data as PublicationDto)?.availability,
			model: data.model,
			selected,
		};
	}

	return {
		title: `${constructChildTitle(data as PublicationChild)} ${
			parrentTitle ? ` (${parrentTitle})` : ``
		}`,
		enriched: data.enriched,
		policy: data.policy,
		model: data.model,
		selected,
	};
};

const BulkExportAdditionalButtons: React.FC<Props> = ({
	periodicalChildren,
}) => {
	const { uuidHeap, updateExportHeap } = useBulkExportContext();
	const { result: currentPublications } = useSearchResultContext();
	const { t } = useTranslation('exports');

	const handleAddAll = useCallback(() => {
		const newUuidHeap = { ...uuidHeap };
		if (periodicalChildren) {
			periodicalChildren.forEach(
				child =>
					(newUuidHeap[child.pid] = formatForUuidHeap('child', child, true)),
			);
		} else {
			currentPublications.forEach(
				pub =>
					(newUuidHeap[pub.pid] = formatForUuidHeap('publication', pub, true)),
			);
		}
		updateExportHeap?.(newUuidHeap);
	}, [uuidHeap, currentPublications, updateExportHeap, periodicalChildren]);

	const handleClearAllVisible = useCallback(() => {
		const newUuidHeap = { ...uuidHeap };
		if (periodicalChildren) {
			periodicalChildren.forEach(
				child =>
					(newUuidHeap[child.pid] = formatForUuidHeap('child', child, false)),
			);
		} else {
			currentPublications.forEach(
				pub =>
					(newUuidHeap[pub.pid] = formatForUuidHeap('publication', pub, false)),
			);
		}
		updateExportHeap?.(newUuidHeap);
	}, [uuidHeap, periodicalChildren, updateExportHeap, currentPublications]);

	const count = useMemo(
		() => Object.keys(uuidHeap).filter(key => uuidHeap[key]?.selected).length,
		[uuidHeap],
	);

	return (
		<Flex alignItems="center">
			<Flex mx={2}>
				<IconButton
					onClick={handleAddAll}
					color="primary"
					tooltip={t('add_all_displayed')}
				>
					<MdPlaylistAddCheck size={26} />
				</IconButton>
			</Flex>
			<Flex mx={2}>
				<IconButton
					onClick={handleClearAllVisible}
					color="primary"
					tooltip={t('remove_all_displayed')}
				>
					<CgPlayListRemove size={26} />
				</IconButton>
			</Flex>
			<Flex mx={2}>
				<IconButton
					onClick={() => updateExportHeap?.({})}
					color="primary"
					tooltip={t('remove_all')}
				>
					<MdClear size={26} />
				</IconButton>
			</Flex>
			<Text mx={3}>
				{t('selected_count')}: <b>{count}</b>
			</Text>
			<BulkExportDialog />
			<UserRequestBulkDialog />
		</Flex>
	);
};

export default BulkExportAdditionalButtons;
