/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import TextareaAutosize, {
	TextareaAutosizeProps,
} from 'react-textarea-autosize';
import { useField, useFormikContext } from 'formik';

import { Box, Flex } from 'components/styled';
import LoaderSpin from 'components/loaders/LoaderSpin';
import ErrorFeedback from 'components/error/ErrorFeedback';

import { theme } from 'theme';

import { InputWrapper, Label } from './TextInput';

type Props = {
	name: string;
	label?: string;
	required?: boolean;

	loading?: boolean;
	minRows?: number;
} & Omit<TextareaAutosizeProps, 'id' | 'ref' | 'onBlur' | 'onChange' | 'value'>;

const TextAreaInput: FC<Props> = ({
	name,
	label,
	required,
	loading,

	...inputProps
}) => {
	const [field, meta] = useField(name);
	const { isSubmitting } = useFormikContext();

	return (
		<Box width={1}>
			{label && (
				<Label htmlFor={name} pr={2} required={required}>
					{label}:
				</Label>
			)}
			<Flex flexGrow={1} position="relative">
				<InputWrapper
					width={1}
					alignItems="center"
					hasError={!!meta.error && meta.touched}
					backgroundColor="white"
				>
					<TextareaAutosize
						minRows={3}
						{...field}
						{...inputProps}
						disabled={isSubmitting || inputProps.disabled}
						css={css`
							flex-basis: 100%;
							border: none;
							background: none;
							padding: ${theme.space[1]}px;

							&:focus {
								box-shadow: none;
							}
						`}
					/>

					{loading && (
						<Box minWidth="auto" ml={1} position="absolute" top={1} right={1}>
							<LoaderSpin size={23} />
						</Box>
					)}
				</InputWrapper>
			</Flex>

			{meta.error && meta.touched && (
				<ErrorFeedback>{meta.error}</ErrorFeedback>
			)}
		</Box>
	);
};
export default TextAreaInput;
