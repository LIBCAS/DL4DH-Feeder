/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useFormik } from 'formik';
import _ from 'lodash';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MdBolt, MdClear, MdSearch } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import useMeasure from 'react-use-measure';
import { useTranslation } from 'react-i18next';

import Accordion from 'components/accordion';
import TextInput from 'components/form/input/TextInput';
import { ClickAway } from 'components/form/select/SimpleSelect';
import { Box, Flex } from 'components/styled';
import IconButton from 'components/styled/IconButton';
import Text, { H4 } from 'components/styled/Text';

import { Loader } from 'modules/loader';

import { api } from 'api';
import { useTheme } from 'theme';

import { useAvailableFilters } from 'api/publicationsApi';

import { useSearchContext } from 'hooks/useSearchContext';

import { NameTagList } from './NameTagList';

const NameTagFilter = () => {
	const [hints, setHints] = useState<string[]>([]);
	const [sp, setSp] = useSearchParams();
	const [nameTagFacet, setNameTagFacet] = useState<string>('');
	const [wrapperRef, { width: wrapperWidth }] = useMeasure({
		debounce: 100,
	});

	const { t } = useTranslation('nametag');

	useEffect(() => {
		setNameTagFacet(sp.get('nameTagFacet') ?? '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const theme = useTheme();
	const { state } = useSearchContext();

	const { data, dataUpdatedAt, isLoading } = useAvailableFilters({
		..._.omit(state.searchQuery, 'page'),
		nameTagFacet,
	});

	const getHint = useCallback(async (q: string) => {
		const hints = await api()
			.post(`search/hint?q=${q}&nameTagType=ALL`, {}) //&nameTagType=ALL
			.json<string[]>()
			.catch(r => console.log(r));

		if (hints) {
			setHints(hints);
		}
	}, []);

	const debouncedHint = useMemo(() => debounce(getHint, 100), [getHint]);

	const formik = useFormik<{ query: string }>({
		initialValues: {
			query: sp.get('nameTagFacet') ?? '',
		},

		onSubmit: async values => {
			if (values.query === '') {
				sp.delete('nameTagFacet');
			} else {
				sp.set('nameTagFacet', values.query);
			}

			setSp(sp);
			setNameTagFacet(values.query);
		},
	});

	const debouncedSubmit = useMemo(
		() => debounce(formik.submitForm, 500),
		[formik.submitForm],
	);

	//const availableNameTagFilters = data?.pages?.[0].availableNameTagFilters;
	const availableNameTagFilters = data?.availableNameTagFilters;
	const {
		handleSubmit,
		handleChange,
		handleBlur,
		setFieldValue,
		values,
		errors,
		touched,
	} = formik;

	const hasNameTags = useMemo(
		() =>
			Object.keys(availableNameTagFilters ?? {}).some(
				k => Object.keys(availableNameTagFilters?.[k] ?? {}).length > 0,
			),
		[availableNameTagFilters],
	);

	if (!hasNameTags && !nameTagFacet) {
		return <></>;
	}
	//TODO: pouzit QuerySearchInput a tiez tam nastavit eclipse na text asi
	return (
		<Box
			bg="#E4F0F3"
			css={css`
				border-top: 2px solid ${theme.colors.primary};
				border-bottom: 2px solid ${theme.colors.primary};
			`}
		>
			<Accordion
				label={
					<Flex alignItems="center">
						<MdBolt size={14} />

						<H4 mx={2}>{t('search_nametag')}</H4>
					</Flex>
				}
				//isLoading={isLoading}
				storeKey="nameTagFacetFilter"
				overflowHiddenDisabled
			>
				<form onSubmit={handleSubmit}>
					<Flex flexDirection="column" p={1} overflow="visible">
						<Flex
							justifyContent="flex-start"
							alignItems="center"
							ref={wrapperRef}
							position="relative"
							overflow="visible"
							zIndex={2}
							css={css`
								box-sizing: border-box;
							`}
						>
							<TextInput
								p={'0px!important'}
								id="query"
								label=""
								labelType="inline"
								labelMinWidth="30px"
								autoComplete="off"
								width="100%"
								title={values.query}
								iconLeft={
									<Flex p={0} m={0} ml={1}>
										<MdSearch size={22} />
									</Flex>
								}
								onClick={e => {
									e.currentTarget?.select?.();
									e.stopPropagation();
								}}
								onBlur={e => {
									handleBlur(e);
								}}
								touched={touched.query}
								onChange={e => {
									e.stopPropagation();
									debouncedHint(e.target.value);
									debouncedSubmit();

									handleChange(e);
								}}
								value={values.query}
								onKeyDown={e => {
									e.stopPropagation();
									if (e.key === 'Enter') {
										formik.submitForm();
									}
								}}
								inputPadding="8px 0px"
								minHeight={50}
								iconRight={
									nameTagFacet !== '' ? (
										<Flex color="primary" mr={1}>
											<IconButton
												color="primary"
												tooltip="Smazat filtr"
												//variant="outlined"
												onClick={() => {
													sp.delete('nameTagFacet');
													setSp(sp);
													setNameTagFacet('');
													setFieldValue('query', '');
												}}
											>
												<MdClear
													size={22}
													css={css`
														cursor: pointer;
													`}
												/>
											</IconButton>
										</Flex>
									) : (
										<></>
									)
								}
							/>

							{hints.length > 0 && (
								<ClickAway onClickAway={() => setHints([])}>
									<Flex
										position="absolute"
										left={0}
										top={35}
										bg="white"
										color="text"
										css={css`
											border: 1px solid ${theme.colors.border};
											border-top: none;
											box-shadow: 0px 5px 8px 2px rgba(0, 0, 0, 0.2);
											box-sizing: border-box;
										`}
									>
										<Flex
											position="relative"
											flexDirection="column"
											overflowY="auto"
											maxHeight="300px"
											width={wrapperWidth}
										>
											{hints.map((h, index) => (
												<Flex
													px={3}
													py={1}
													key={index}
													onClick={() => {
														setFieldValue('query', h);
														formik.submitForm();
														setHints([]);
													}}
													css={css`
														cursor: default;
														border-bottom: 1px solid
															${theme.colors.primaryLight};
														&:hover {
															color: white;
															background-color: ${theme.colors.primary};
														}
													`}
												>
													<Text fontSize="md" my="2px">
														{h}
													</Text>
												</Flex>
											))}
										</Flex>
									</Flex>
								</ClickAway>
							)}
						</Flex>

						<Box>
							<Text>{errors.query}</Text>
						</Box>
						{/* <Box alignSelf="end" mt={1}>
							<Button type="submit" variant="primary">
								Použít
							</Button>
						</Box> */}
					</Flex>
				</form>
			</Accordion>

			{isLoading ? (
				<Loader />
			) : (
				<NameTagList
					key={dataUpdatedAt}
					nameTagData={availableNameTagFilters}
				/>
			)}
		</Box>
	);
};

export default NameTagFilter;
