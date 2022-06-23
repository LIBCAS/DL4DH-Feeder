/** @jsxImportSource @emotion/react */
import { useFormik } from 'formik';
import { useSearchParams } from 'react-router-dom';

import TextInput from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text from 'components/styled/Text';

const NameTagFilter = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const formik = useFormik<{ query: string }>({
		initialValues: {
			query: '',
		},

		onSubmit: values => {
			/* searchParams.set('from', values.yearFrom);
			searchParams.set('to', values.yearTo);
			setSearchParams(searchParams); */
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
			<Flex flexDirection="column" p={3}>
				<Flex justifyContent="flex-start" alignItems="center">
					<TextInput
						p={'0px!important'}
						id="query"
						label="Vyhledat"
						labelType="aboveInput"
						labelMinWidth="30px"
						width="100%"
						onClick={e => {
							e.currentTarget.select();
							e.stopPropagation();
						}}
						onBlur={e => {
							handleBlur(e);
						}}
						touched={touched.query}
						onChange={handleChange}
						value={values.query}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								alert('enter');
							}
						}}
						inputPadding="8px"
					/>
				</Flex>
				<Box>
					<Text>{errors.query}</Text>
				</Box>
				<Box alignSelf="end" mt={3}>
					<Button type="submit" variant="primary">
						Použít
					</Button>
				</Box>
			</Flex>
		</form>
	);
};

export default NameTagFilter;
