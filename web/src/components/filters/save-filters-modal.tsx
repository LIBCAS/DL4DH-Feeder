/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { Dialog } from '@reach/dialog';
import { FC, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import Paper from 'components/styled/Paper';
import { H1 } from 'components/styled/Text';
import Button from 'components/styled/Button';
import { Flex } from 'components/styled';
import IconButton from 'components/styled/IconButton';
import TextInput from 'components/form/input/TextInput';

import { useTheme } from 'theme';
import { api } from 'api';

import { useSearchContext } from 'hooks/useSearchContext';

const SaveFiltersModal: FC<{
	isOpen: boolean;
	onDismiss: () => void;
}> = ({ isOpen, onDismiss }) => {
	const { state } = useSearchContext();
	const theme = useTheme();
	const { t } = useTranslation();
	const [filterName, setFilterName] = useState('');
	const [loading, setLoading] = useState(false);
	const handleSaveFilter = useCallback(async () => {
		const body = {
			pageSize: 15,
			page: 0,
			query: '',
			sort: 'TITLE_ASC',
			availability: 'PUBLIC',

			...state.searchQuery,
			name: filterName,
		};
		setLoading(true);
		const resp = await api().post('search?save=true', {
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});

		if (resp.ok) {
			toast.success('Filter byl úspěšně uložen');
			onDismiss();
		} else {
			setLoading(false);
		}
	}, [state.searchQuery, filterName, onDismiss]);
	return (
		<Dialog
			isOpen={isOpen}
			onDismiss={onDismiss}
			css={css`
				padding: 0 !important;
				min-width: ${theme.breakpoints[0]};

				@media (max-width: ${theme.breakpoints[0]}) {
					width: 100% !important;
					min-width: unset;
				}
			`}
		>
			<Flex
				alignItems="center"
				justifyContent="center"
				overflow="visible"
				m={[1, 5]}
			>
				<Paper bg="paper" minWidth={['80%', 400]} overflow="visible">
					<Flex width={1} justifyContent="space-between" alignItems="center">
						<H1 my={3}>Uložit filtry</H1>
						<IconButton color="primary" onClick={onDismiss}>
							<MdClose size={32} />
						</IconButton>
					</Flex>
					<TextInput
						mt={3}
						label="Jméno filtru"
						value={filterName}
						onChange={e => setFilterName(e.target.value)}
						disabled={loading}
					/>
					<Button
						disabled={!filterName || loading}
						loading={loading}
						my={3}
						variant="primary"
						onClick={handleSaveFilter}
					>
						{t('common:save')}
					</Button>
				</Paper>
			</Flex>
		</Dialog>
	);
};
export default SaveFiltersModal;
