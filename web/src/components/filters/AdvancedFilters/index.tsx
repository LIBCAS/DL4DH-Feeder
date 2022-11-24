import React, { useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Flex } from 'components/styled';
import ModalDialog from 'components/modal';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import Text, { H1, H2 } from 'components/styled/Text';
import IconButton from 'components/styled/IconButton';
import SimpleSelect from 'components/form/select/SimpleSelect';
import TextInput from 'components/form/input/TextInput';

import { AdvancedFilterFieldEnum } from 'api/models';

type FieldOption = {
	id: AdvancedFilterFieldEnum;
	label: string;
};

const fieldOptions: FieldOption[] = [
	{ id: 'TITLE', label: '' },
	{ id: 'AUTHOR', label: '' },
	{ id: 'KEYWORDS', label: '' },
	{ id: 'NUMBERS_IN_ADDRESSES', label: '' },
	{ id: 'GEOGRAPHICAL_NAMES', label: '' },
	{ id: 'INSTITUTIONS', label: '' },
	{ id: 'MEDIA_NAMES', label: '' },
	{ id: 'NUMBER_EXPRESSIONS', label: '' },
	{ id: 'ARTIFACT_NAMES', label: '' },
	{ id: 'PERSONAL_NAMES', label: '' },
	{ id: 'TIME_EXPRESSIONS', label: '' },
	{ id: 'COMPLEX_PERSON_NAMES', label: '' },
	{ id: 'COMPLEX_TIME_EXPRESSION', label: '' },
	{ id: 'COMPLEX_ADDRESS_EXPRESSION', label: '' },
	{ id: 'COMPLEX_BIBLIO_EXPRESSION', label: '' },
	{ id: 'ALL_BASIC_METADATA', label: '' },
	{ id: 'ALL_NAMETAG_DATA', label: '' },
	{ id: 'NONE', label: '' },
];

export const AdvancedFilter: React.FC = () => {
	const { t } = useTranslation('advanced_search');
	const [sp, setSp] = useSearchParams();
	const [query, setQuery] = useState<string | null>(sp.get('value'));
	const [field, setField] = useState<FieldOption | null>(
		fieldOptions.find(fo => fo.id === sp.get('field')) ?? null,
	);

	return (
		<Flex alignItems="center">
			<ModalDialog
				label={t('advanced_search:title')}
				control={openModal => (
					<Button variant="text" onClick={openModal}>
						{t('advanced_search:title')}
					</Button>
				)}
			>
				{closeModal => (
					<Flex
						alignItems="center"
						justifyContent="center"
						overflow="visible"
						m={0}
					>
						<Paper
							bg="paper"
							margin="5vh auto"
							m={0}
							minWidth={['initial', '50vw']}
							overflow="visible"
							width={'60%'}
							minHeight={'60vh'}
						>
							<Flex alignItems="center" justifyContent="space-between">
								<H1>{t('title')}</H1>
								<IconButton color="primary" onClick={closeModal}>
									<MdClose size={32} />
								</IconButton>
							</Flex>
							<Flex alignItems="center" flexDirection="column">
								<H2>{t('field.field')}</H2>
								<SimpleSelect
									width={300}
									options={fieldOptions}
									nameFromOption={item => item?.id ?? ''}
									value={field}
									onChange={item => setField(item)}
									keyFromOption={item => item?.id ?? ''}
								/>
								<H2 mt={3}>{t('query.tab')}</H2>
								<TextInput
									label=""
									labelMinWidth="0"
									labelType="inline"
									value={query ?? ''}
									placeholder={t('field.value_placeholder')}
									onChange={e => setQuery(e.target.value)}
								/>
								<Button
									variant="primary"
									mt={3}
									onClick={() => {
										sp.set('field', field?.id ?? 'NONE');
										sp.set('value', query ?? '');
										setSp(sp);
										closeModal();
									}}
								>
									<MdSearch size={22} />
									<Text ml={2} my={0}>
										{t('field.search')}
									</Text>
								</Button>
							</Flex>
						</Paper>
					</Flex>
				)}
			</ModalDialog>
		</Flex>
	);
};

export default AdvancedFilter;
