/** @jsxImportSource @emotion/react */
import { useFormik } from 'formik';
import { FC, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import TextInput from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text from 'components/styled/Text';

//TODO: toto obmedzenie nakoniec nechcu - min a maxYear, cize zatial zakomentovavam a obmedzuje sa len na [0, aktualny rok]
const PublishDateFilterForm: FC<{
	interval?: { maxYear: number; minYear: number };
}> = () => {
	const { t } = useTranslation('search');
	const maxYear = new Date().getFullYear(); //interval?.maxYear ?? new Date().getFullYear();
	const minYear = 0; //interval?.minYear ?? 0;
	const [searchParams, setSearchParams] = useSearchParams();
	const formik = useFormik<{ yearFrom: string; yearTo: string }>({
		initialValues: {
			yearFrom: searchParams.get('from') ?? minYear.toString(),
			yearTo: searchParams.get('to') ?? maxYear.toString(),
		},

		onSubmit: values => {
			searchParams.set('from', values.yearFrom);
			searchParams.set('to', values.yearTo);
			setSearchParams(searchParams);
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

	const validateDate = useCallback(
		(field: keyof typeof values) => {
			const dates = {
				yearFrom: parseInt(values.yearFrom),
				yearTo: parseInt(values.yearTo),
			};
			dates.yearFrom = isNaN(dates.yearFrom) ? minYear : dates.yearFrom;
			dates.yearTo = isNaN(dates.yearTo) ? maxYear : dates.yearTo;

			if (dates[field] > maxYear) {
				setFieldValue(field, maxYear);
			}
			if (dates[field] < minYear) {
				setFieldValue(field, minYear);
			}

			if (field === 'yearFrom') {
				setFieldValue(
					'yearFrom',
					Math.max(Math.min(dates.yearFrom, dates.yearTo), minYear),
				);
			}
			if (field === 'yearTo') {
				setFieldValue(
					'yearTo',
					Math.min(Math.max(dates.yearFrom, dates.yearTo), maxYear),
				);
			}
		},
		[values, setFieldValue, maxYear, minYear],
	);

	// validate once url params
	useEffect(() => {
		validateDate('yearFrom');
		validateDate('yearTo');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<form onSubmit={handleSubmit}>
			<Flex flexDirection="column" p={3}>
				<Flex justifyContent="flex-start" alignItems="center">
					<TextInput
						p={'0px!important'}
						id="yearFrom"
						label={t('year-range.from')}
						labelType="leftToInput"
						labelMinWidth="30px"
						width="unset"
						hideArrows
						type="number"
						onBlur={e => {
							validateDate('yearFrom');
							handleBlur(e);
						}}
						touched={touched.yearFrom}
						onChange={handleChange}
						value={values.yearFrom}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								//alert('enter');
							}
						}}
						inputPadding="8px"
					/>
					<TextInput
						ml={2}
						id="yearTo"
						label={t('year-range.to')}
						labelType="leftToInput"
						labelMinWidth="30px"
						width="unset"
						hideArrows
						type="number"
						onChange={handleChange}
						onBlur={e => {
							validateDate('yearTo');
							handleBlur(e);
						}}
						error={errors.yearTo}
						touched={touched.yearTo}
						value={values.yearTo}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								alert('enter');
							}
						}}
						inputPadding="8px"
					/>
				</Flex>
				<Box>
					<Text>{errors.yearFrom}</Text>
					<Text>{errors.yearTo}</Text>
				</Box>
				<Box alignSelf="end" mt={3}>
					<Button type="submit" variant="primary">
						{t('year-range.apply')}
					</Button>
				</Box>
			</Flex>
		</form>
	);
};

export default PublishDateFilterForm;
