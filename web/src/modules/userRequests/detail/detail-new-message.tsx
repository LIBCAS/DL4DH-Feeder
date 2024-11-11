/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import { FormikConsumer, FormikProvider, useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { Box, Flex } from 'components/styled';
import Divider from 'components/styled/Divider';
import Button from 'components/styled/Button';
import TextAreaInput from 'components/form/input/TextAreaInput';
import TextInput, { Chip } from 'components/form/input/TextInput';

import { useTheme } from 'theme';
import { UserRequestDto } from 'models/user-requests';

import { postNewUserRequestMessage } from 'api/userRequestsApi';

export const UserRequestDetailNewMessageForm: FC<{
	detail: UserRequestDto;
	afterSubmit: () => void;
	onCancel: () => void;
}> = ({ detail, afterSubmit, onCancel }) => {
	const theme = useTheme();
	const { t } = useTranslation('requests');
	const { t: tCommon } = useTranslation('common');
	const { handleSubmit, isSubmitting, ...rest } = useFormik<{
		message: string;
		files: File[];
	}>({
		initialValues: {
			message: '',
			files: [],
		},
		onSubmit: async values => {
			const response = await postNewUserRequestMessage(
				detail.id,
				values.message,
				values.files,
			);
			if (response.ok) {
				afterSubmit();
			} else {
				console.log(response);
				toast.error(
					`Unable to create message: ${response.status}: ${response.statusText}`,
				);
			}
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
				<FormikProvider value={{ handleSubmit, isSubmitting, ...rest }}>
					<TextAreaInput name="message" minRows={10} disabled={isSubmitting} />
					<FormikConsumer>
						{({ setFieldValue, values, isSubmitting }) => (
							<>
								<TextInput
									disabled={isSubmitting}
									mt={2}
									type="file"
									multiple
									name="files"
									id="files"
									label={t('attachments.label')}
									onChange={e => {
										if (e.target.files && e.target.files.length > 0) {
											setFieldValue('files', Array.from(e.target.files));
										}
									}}
								/>

								<RenderFileList
									files={values.files}
									onRemove={fileIndex => {
										setFieldValue('files', [
											...values.files.filter((file, i) => i !== fileIndex),
										]);
									}}
								/>
							</>
						)}
					</FormikConsumer>

					<Divider my={2} />
					<Flex justifyContent="space-between">
						<Button
							onClick={onCancel}
							variant="text"
							disabled={isSubmitting}
							loading={isSubmitting}
						>
							{tCommon('cancel')}
						</Button>
						<Button
							type="submit"
							variant="primary"
							disabled={isSubmitting}
							loading={isSubmitting}
						>
							{tCommon('submit')}
						</Button>
					</Flex>
				</FormikProvider>
			</form>
		</Box>
	);
};

const RenderFileList: FC<{
	files: File[];
	onRemove: (fileIndex: number) => void;
}> = ({ files, onRemove }) => {
	return (
		<Flex m={2} flexWrap="wrap" style={{ gap: 16 }}>
			{files.map((file, index) => (
				<Chip
					p={2}
					key={`file-${index}`}
					onClose={() => onRemove(index)}
					withCross
				>
					{file.name}
				</Chip>
			))}
		</Flex>
	);
};
