import { useCallback, useMemo } from 'react';
import { MdClear, MdPlaylistAddCheck } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';

import { useBulkExportContext } from 'hooks/useBulkExport';
import { useSearchResultContext } from 'hooks/useSearchResultContext';

import BulkExportDialog from './BulkExportDialog';

const BulkExportAdditionalButtons: React.FC = () => {
	const { uuidHeap, setUuidHeap } = useBulkExportContext();
	const { result: currentPublications } = useSearchResultContext();
	const { t } = useTranslation('exports');

	const handleAddAll = useCallback(() => {
		const newUuidHeap = { ...uuidHeap };
		currentPublications.forEach(
			publication =>
				(newUuidHeap[publication.pid] = { selected: true, publication }),
		);
		setUuidHeap?.(newUuidHeap);
	}, [uuidHeap, currentPublications, setUuidHeap]);

	const handleClearAllVisible = useCallback(() => {
		const newUuidHeap = { ...uuidHeap };
		currentPublications.forEach(
			publication =>
				(newUuidHeap[publication.pid] = { selected: false, publication }),
		);
		setUuidHeap?.(newUuidHeap);
	}, [uuidHeap, currentPublications, setUuidHeap]);

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
					onClick={() => setUuidHeap?.({})}
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
		</Flex>
	);
};

export default BulkExportAdditionalButtons;
