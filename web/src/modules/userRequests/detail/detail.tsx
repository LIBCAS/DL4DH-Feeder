/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import Dialog from '@reach/dialog';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H1, H4 } from 'components/styled/Text';
import Accordion from 'components/accordion';

import { Loader } from 'modules/loader';

import { UserRequestListDto } from 'models/user-requests';
import { useTheme } from 'theme';
import { getDateString, getTimeString } from 'utils';

import { useUserRequestDetail } from 'api/userRequestsApi';

import { UserRequestDetailMessages } from './detail-messages';
import { UserRequestDetailParts } from './detail-parts';

type Props = {
	closeModal: () => void;
	requestDto: UserRequestListDto;
};

const UserRequestDetail: FC<Props> = ({ closeModal, requestDto }) => {
	const { t } = useTranslation('requests');
	const { t: tCommon } = useTranslation('common');
	const response = useUserRequestDetail(requestDto.id);
	//const theme = useTheme();
	if (response.isLoading) {
		return (
			<Paper bg="paper" minWidth={['80%', 500]} overflow="visible">
				<Loader />;
			</Paper>
		);
	}
	const detail = response.data;
	if (!detail) {
		return <></>;
	}
	return (
		<Flex
			alignItems="center"
			justifyContent="center"
			overflow="visible"
			m={[1, 5]}
		>
			<Paper bg="paper" minWidth={['80%', 800, 1200]} overflow="visible">
				<Box>
					<Flex width={1} justifyContent="space-between" alignItems="center">
						<H1 my={3}>{t('detail.title')}</H1>
						<IconButton color="primary" onClick={closeModal}>
							<MdClose size={32} />
						</IconButton>
					</Flex>

					<Text>
						{t(`state.label`)}: <b>{t(`state.${detail.state}`)}</b>
					</Text>
					<Box mt={2}>
						<Text my={2}>
							{t(`type.label`)}: <b>{t(`type.${detail.type}`)}</b>
						</Text>
					</Box>
					<Text>
						{tCommon('created')}:{' '}
						<b>
							{requestDto.created
								? `${getDateString(new Date(detail.created))} ${getTimeString(
										new Date(detail.created),
								  )}`
								: '--'}
						</b>
					</Text>

					<Divider my={3} />
					{/* <Accordion
						label="Správy"
						//isExpanded
						css={css`
							min-height: 600px;
						`}
					> */}
					<H4>{t('detail.messages')}</H4>
					<UserRequestDetailMessages
						detail={detail}
						refetchDetail={response.refetch}
					/>
					{/* </Accordion> */}
					<Accordion label={t('detail.parts')} isExpanded>
						<UserRequestDetailParts detail={detail} />
					</Accordion>

					<Flex my={1} justifyContent="flex-end" alignItems="center" mt={5}>
						<Button variant="primary" ml={3} onClick={closeModal}>
							{tCommon('close')}
						</Button>
					</Flex>
				</Box>
			</Paper>
		</Flex>
	);
};

const UserRequestDetailDialog: FC<{
	requestDto: UserRequestListDto;
	onDismiss: () => void;
	isOpen: boolean;
}> = ({ requestDto, isOpen, onDismiss }) => {
	const theme = useTheme();
	return (
		<Dialog
			onDismiss={onDismiss}
			isOpen={isOpen}
			css={css`
				padding: 0 !important;
				min-width: ${theme.breakpoints[0]};

				@media (max-width: ${theme.breakpoints[0]}) {
					width: 100% !important;
					min-width: unset;
				}
			`}
		>
			<UserRequestDetail closeModal={onDismiss} requestDto={requestDto} />
		</Dialog>
	);
};

export default UserRequestDetailDialog;
