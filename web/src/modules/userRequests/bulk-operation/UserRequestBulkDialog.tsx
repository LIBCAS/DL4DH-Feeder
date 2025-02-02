/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose, MdInfo } from 'react-icons/md';
import { FormikConsumer, FormikProvider, useFormik } from 'formik';
import { noop } from 'lodash-es';
import { toast } from 'react-toastify';

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text, { H1 } from 'components/styled/Text';
import ModalDialog from 'components/modal';
import Paper from 'components/styled/Paper';
import IconButton from 'components/styled/IconButton';
import TextAreaInput from 'components/form/input/TextAreaInput';
import RadioButton from 'components/styled/RadioButton';
import Divider from 'components/styled/Divider';
import { EditSelectedPublications } from 'components/tiles/TilesWithCheckbox';
import TextInput, { Chip } from 'components/form/input/TextInput';

import { UserRequestCreateDto, UserRequestType } from 'models/user-requests';

import { userRequestCreateNew } from 'api/userRequestsApi';

import { useBulkExportContext } from 'hooks/useBulkExport';

const RequestForm: FC<{
	closeModal: () => void;
}> = ({ closeModal }) => {
	const { t } = useTranslation('requests');
	const { t: tCommon } = useTranslation('common');
	const exportCtx = useBulkExportContext();
	const data = useMemo(
		() =>
			(
				Object.keys(exportCtx.uuidHeap).filter(
					k => exportCtx.uuidHeap[k].selected,
				) ?? []
			).map(id => ({ ...exportCtx.uuidHeap[id], id })),
		[exportCtx],
	);
	const formik = useFormik<UserRequestCreateDto>({
		initialValues: {
			publicationIds: data.map(d => d.id),
			message: '',
			type: UserRequestType.ENRICHMENT,
			files: [],
		},
		onSubmit: async values => {
			const response = await userRequestCreateNew(values);
			if (response.ok) {
				closeModal();
			} else {
				console.log(response);
				toast.error(
					`${t('create_error')}: ${response.status}: ${response.statusText}`,
				);
			}
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<FormikProvider value={{ ...formik }}>
				<Flex
					alignItems="center"
					justifyContent="center"
					overflow="visible"
					m={5}
				>
					<Paper
						bg="paper"
						maxWidth={600}
						minWidth={['initial', 500]}
						overflow="visible"
						position="relative"
					>
						<Flex width={1} justifyContent="space-between" alignItems="center">
							<H1 my={3}>{t('new.title')}</H1>
							<IconButton
								color="primary"
								onClick={closeModal}
								css={css`
									z-index: 3;
								`}
							>
								<MdClose size={32} />
							</IconButton>
						</Flex>
						<Flex
							mb={3}
							alignItems="center"
							justifyContent="space-between"
							mr={2}
						>
							<Text my={2}>{t(`type.label_long`)}</Text>

							<RadioButton
								label={t(`type.${UserRequestType.ENRICHMENT}`)}
								name="request-type-radio-grp"
								id="radio-enrichment"
								checked={formik.values.type === UserRequestType.ENRICHMENT}
								onChange={() => {
									formik.setFieldValue('type', UserRequestType.ENRICHMENT);
								}}
							/>
							<RadioButton
								label={t(`type.${UserRequestType.EXPORT}`)}
								name="request-type-radio-grp"
								id="radio-export"
								checked={formik.values.type === UserRequestType.EXPORT}
								onChange={() => {
									formik.setFieldValue('type', UserRequestType.EXPORT);
								}}
							/>
						</Flex>
						<TextAreaInput
							label={t('message.label')}
							name="message"
							minRows={10}
						/>
						<FormikConsumer>
							{({ setFieldValue, values }) => (
								<>
									<TextInput
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

									<Flex m={2} flexWrap="wrap" style={{ gap: 16 }}>
										{values.files.map((file, index) => (
											<Chip
												p={2}
												key={`file-${index}`}
												onClose={() =>
													setFieldValue('files', [
														...values.files.filter((file, i) => i !== index),
													])
												}
												withCross
											>
												{file.name}
											</Chip>
										))}
									</Flex>
								</>
							)}
						</FormikConsumer>

						<Divider my={3} />
						<Flex my={3} justifyContent="space-between" alignItems="center">
							<Flex>
								<Button
									variant="primary"
									type="submit"
									disabled={formik.isSubmitting || data.length < 1}
									loading={formik.isSubmitting}
								>
									{tCommon('submit')}
								</Button>
								<Button
									variant="outlined"
									ml={3}
									onClick={closeModal}
									css={css`
										z-index: 3;
									`}
								>
									{tCommon('cancel')}
								</Button>
							</Flex>
							<Flex alignItems="center">
								<MdInfo size={20} />
								<Text ml={2}>
									{data.length} {t('exports:dialog.publications_count')} |{' '}
								</Text>
								<EditSelectedPublications preSelected={[]} onEdit={noop} />
							</Flex>
						</Flex>
					</Paper>
				</Flex>
			</FormikProvider>
		</form>
	);
};

const UserRequestBulkDialog: FC = () => {
	const { t } = useTranslation('requests');
	return (
		<ModalDialog
			label="Info"
			control={openModal => (
				<Button
					px={2}
					ml={2}
					minWidth={60}
					variant="primary"
					onClick={openModal}
					tooltip={t('new.title')}
				>
					{t('new.title')}
				</Button>
			)}
		>
			{closeModal => <RequestForm closeModal={closeModal} />}
		</ModalDialog>
	);
};

export default UserRequestBulkDialog;
