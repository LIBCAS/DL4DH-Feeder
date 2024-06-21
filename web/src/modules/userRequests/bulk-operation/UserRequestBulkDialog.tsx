/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose, MdInfo } from 'react-icons/md';
import { FormikProvider, useFormik } from 'formik';
import { noop } from 'lodash-es';

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

import { UserRequestCreateDto, UserRequestType } from 'models/user-requests';

import { useBulkExportContext } from 'hooks/useBulkExport';

const RequestForm: FC<{
	closeModal: () => void;
}> = ({ closeModal }) => {
	const { t } = useTranslation('requests');
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
		},
		onSubmit: values => {
			console.log(values);
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
						<Divider my={3} />
						<Flex my={3} justifyContent="space-between" alignItems="center">
							<Flex>
								<Button
									variant="primary"
									type="submit"
									disabled={formik.isSubmitting || data.length < 1}
									loading={formik.isSubmitting}
								>
									{t('exports:dialog.finish_export_button')}
								</Button>
								<Button
									variant="outlined"
									ml={3}
									onClick={closeModal}
									css={css`
										z-index: 3;
									`}
								>
									{t('exports:dialog.cancel')}
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
	const { t } = useTranslation('exports');
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
					tooltip={t('user-request-tooltip')}
				>
					{t('Žádost')}
				</Button>
			)}
		>
			{closeModal => <RequestForm closeModal={closeModal} />}
		</ModalDialog>
	);
};

export default UserRequestBulkDialog;
