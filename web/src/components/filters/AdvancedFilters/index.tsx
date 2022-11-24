/** @jsxImportSource @emotion/react */
import React, { FC, useState } from 'react';
import { css } from '@emotion/react';
import { MdClose, MdHelp, MdSearch } from 'react-icons/md';
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

import { useTheme } from 'theme';

import { AdvancedFilterFieldEnum } from 'api/models';

const B: FC = ({ children }) => (
	<Text color="primary" fontWeight="normal" as="span">
		{children}
	</Text>
);

type FieldOption = {
	id: AdvancedFilterFieldEnum;
	label: string;
};

const fieldOptions: FieldOption[] = [
	{ id: 'NONE', label: 'field.all' },
	{ id: 'TITLE', label: 'field.title' },
	{ id: 'AUTHOR', label: 'field.author' },
	{ id: 'KEYWORDS', label: 'field.keyword' },
	{ id: 'NUMBERS_IN_ADDRESSES', label: '' },
	{ id: 'GEOGRAPHICAL_NAMES', label: 'field.geoname' },
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
];

export const AdvancedFilter: React.FC = () => {
	const { t } = useTranslation('advanced_search');
	const theme = useTheme();
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
									nameFromOption={item => {
										if (item !== null && item.label !== '') {
											return t(item.label);
										}
										return item?.id ?? '';
									}}
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
									disabled={!query}
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
								<Flex
									flexDirection="column"
									justifyContent="flex-start"
									alignItems="flex-start"
									width={1}
									maxHeight={500}
									overflow="auto"
									mt={4}
									p={2}
									css={css`
										border: 1px solid ${theme.colors.border};
									`}
								>
									<Flex alignItems="center">
										<MdHelp size={20} />
										<H2 ml={2}>Užitečná pravidla pro pokročilé vyhledávání</H2>
									</Flex>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										Karel Hynek Mácha
									</Text>
									<Text>
										při vyhledávání víceslovného výrazu je v pořadí
										upřednostněna přesná shoda výrazu se jmény autorů (ve tvaru
										jméno příjmení) a hlavními názvy publikací
									</Text>

									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										{'"'}Máchův Máj{'"'}
									</Text>
									<Text>
										vyhledá výrazy obsahující frázi v uvozovkách, tj.{' '}
										<B>Máchův Máj</B>
									</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										Mácha AND Máj
									</Text>
									<Text>
										vyhledá výrazy obsahující zároveň jak <B>Mácha</B>, tak{' '}
										<B>Máj</B>
									</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										Mácha OR Máj
									</Text>
									<Text>
										vyhledá výrazy obsahující aspoň jedno ze slov <B>Mácha</B>{' '}
										nebo <B>Máj</B>
									</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										Mácha NOT Máj nebo Mácha -Máj
									</Text>
									<Text>
										vyhledá záznamy, které obsahují <B>Mácha</B> a neobsahují{' '}
										<B>Máj</B>
									</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										macha AND (maj OR (zivot AND dilo))
									</Text>
									<Text>v dotazech lze používat závorky (i vnořené)</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										+Mácha Máj
									</Text>
									<Text>
										vyhledá záznamy, které musí obsahovat <B>Mácha</B> a můžou
										obsahovat <B>Máj</B>
									</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										M*cha
									</Text>
									<Text>
										vyhledá výrazy s prázdným či libovolně dlouhým řetězcem
										jakýchkoliv znaků na místě * (nelze použít místo prvních
										písmen)
									</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										M?cha
									</Text>
									<Text>
										vyhledá výrazy začínající na M a končící na cha s jedním
										libovolným znakem na místě ? (nelze použít místo prvního
										písmene)
									</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										Mácha~ / Mácha~0.8
									</Text>
									<Text>
										vyhledá výrazy podobné jako Mácha (Mucha, Vácha); míra
										podobnosti se nastavuje hodnotou od 0 do 1 (není-li zadána,
										nastaví se na 0.5)
									</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										{'"'}Mácha Máj{'"'}~3
									</Text>
									<Text>
										proximitní vyhledávání; vyhledá výrazy, kde mezi{' '}
										<B>Mácha</B> a <B>Máj</B> (v libovolném pořadí) leží
										maximálně tři jiná slova
									</Text>
									<Text mt={3} mb={0} color="primary" fontWeight="bold">
										Mácha Máj^8 básně^6
									</Text>
									<Text>
										preferenční vyhledávání, kde váhu slova určuje hodnota za ^
										(nejnižší váhu má výraz bez ^)
									</Text>
								</Flex>
							</Flex>
						</Paper>
					</Flex>
				)}
			</ModalDialog>
		</Flex>
	);
};

export default AdvancedFilter;
