/** @jsxImportSource @emotion/react */
import { useFormik } from 'formik';
import { debounce } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import { css } from '@emotion/core';
import useMeasure from 'react-use-measure';
import { useSearchParams } from 'react-router-dom';
import { MdClose } from 'react-icons/md';

import TextInput from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text from 'components/styled/Text';
import { ClickAway } from 'components/form/select/SimpleSelect';
import IconButton from 'components/styled/IconButton';

import { api } from 'api';
import { useTheme } from 'theme';
import { CheckmarkIcon } from 'assets';

const NameTagFilter = () => {
	const [hints, setHints] = useState<string[]>([]);
	const [wrapperRef, { width: wrapperWidth }] = useMeasure({
		debounce: 100,
	});

	const theme = useTheme();

	const [sp, setSp] = useSearchParams();

	const getHint = useCallback(async (q: string) => {
		const hints = await api()
			.post(`search/hint?q=${q}&nameTagType=ALL`, {})
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

		onSubmit: values => {
			sp.set('nameTagFacet', values.query);
			setSp(sp);
			console.log({ values });
		},
	});

	const {
		handleSubmit,
		handleChange,
		handleBlur,
		setFieldValue,
		values,
		errors,
		touched,
	} = formik;

	return (
		<form onSubmit={handleSubmit}>
			<Flex flexDirection="column" p={3} overflow="visible">
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
						label="Vyhledat"
						labelType="aboveInput"
						labelMinWidth="30px"
						width="100%"
						onClick={e => {
							e.currentTarget?.select?.();
							e.stopPropagation();
						}}
						onBlur={e => {
							handleBlur(e);
						}}
						touched={touched.query}
						onChange={e => {
							debouncedHint(e.target.value);
							handleChange(e);
						}}
						value={values.query}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								alert('enter');
							}
						}}
						inputPadding="8px"
					/>
					{hints.length > 0 && (
						<ClickAway onClickAway={() => setHints([])}>
							<Flex
								position="absolute"
								left={0}
								top={62}
								bg="white"
								color="text"
								css={css`
									border: 1px solid ${theme.colors.border};
									border-top: none;
									box-shadow: 0px 5px 8px 2px rgba(0, 0, 0, 0.2);
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
												setHints([]);
											}}
											css={css`
												cursor: default;
												border-bottom: 1px solid ${theme.colors.primaryLight};
												&:hover {
													color: white;
													background-color: ${theme.colors.primary};
												}
											`}
										>
											<Text fontSize="md">{h}</Text>
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
				<Box alignSelf="end" mt={1}>
					<Button type="submit" variant="primary">
						Použít
					</Button>
				</Box>
				{formik.initialValues.query && (
					<>
						<Box mt={3}>
							<Text color="warning" fontWeight="bold" my={0} fontSize="md">
								Aktivní filter:
							</Text>
						</Box>
						<Flex
							py={1}
							width={1}
							mt={2}
							justifyContent="space-between"
							alignItems="center"
							onClick={() => {
								sp.delete('nameTagFacet');
								setSp(sp);
							}}
							fontSize="sm"
							css={css`
								cursor: pointer;
								&:hover,
								&:hover {
									font-weight: bold;
									color: ${theme.colors.warning};
								}
								&:hover .filter-cross-icon {
									visibility: visible;
									color: ${theme.colors.warning};
								}
								&:hover .filter-active-icon {
									visibility: hidden;
								}
								.filter-cross-icon {
									visibility: hidden;
								}
							`}
						>
							<Flex alignItems="center" position="relative">
								<IconButton
									className="filter-cross-icon"
									mr={2}
									position="absolute"
									left={0}
									top={0}
								>
									<MdClose size={15} />
								</IconButton>
								<IconButton
									className="filter-active-icon"
									mr={2}
									position="absolute"
									left={0}
								>
									<CheckmarkIcon size={13} color="primary" />
								</IconButton>
								<Text ml={3} my={0} py={0}>
									{formik.initialValues.query}
								</Text>
							</Flex>
						</Flex>
					</>
				)}
			</Flex>
		</form>
	);
};

export default NameTagFilter;
