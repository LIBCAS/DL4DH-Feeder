/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import { FormikProvider, useFormik } from 'formik';

import { Box, Flex } from 'components/styled';
import Divider from 'components/styled/Divider';
import Button from 'components/styled/Button';
import TextAreaInput from 'components/form/input/TextAreaInput';

import { useTheme } from 'theme';
import { UserRequestDto } from 'models/user-requests';

export const UserRequestDetailNewMessageForm: FC<{
	detail: UserRequestDto;
	afterSubmit: () => void;
	onCancel: () => void;
}> = ({ afterSubmit, onCancel }) => {
	const theme = useTheme();
	const { handleSubmit, ...rest } = useFormik<{ message: string }>({
		initialValues: {
			message: '',
		},
		onSubmit: values => {
			console.log(values);
			afterSubmit();
		},
	});
	return (
		<Box
			p={3}
			width={1}
			bg="white"
			css={css`
				border: 1px solid ${theme.colors.border};
			`}
		>
			<form onSubmit={handleSubmit}>
				<FormikProvider value={{ handleSubmit, ...rest }}>
					<TextAreaInput name="message" minRows={10} />
					<Divider my={2} />
					<Flex justifyContent="space-between">
						<Button onClick={onCancel} variant="text">
							Zrušit
						</Button>
						<Button type="submit" variant="primary">
							Odeslat
						</Button>
					</Flex>
				</FormikProvider>
			</form>
		</Box>
	);
};
