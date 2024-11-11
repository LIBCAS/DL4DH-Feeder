/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useState } from 'react';
import { MdDownload } from 'react-icons/md';
import { toast } from 'react-toastify';

import { Chip } from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';
import Button from 'components/styled/Button';

import { UserRequestDto } from 'models/user-requests';
import { downloadFile } from 'utils';

import { getUserRequestFiles } from 'api/userRequestsApi';

import { UserRequestDetailNewMessageForm } from './detail-new-message';

export const UserRequestDetailMessages: FC<{
	detail: UserRequestDto;
	refetchDetail: () => void;
}> = ({ detail, refetchDetail }) => {
	const [showNewMessageForm, setShowNewMessageForm] = useState(false);
	return (
		<Box
			p={3}
			bg="paper"
			css={css`
				max-height: 500px;
				overflow-y: auto;
				//box-shadow: inset 0px 3px 6px 2px rgba(0, 0, 0, 0.05);
			`}
		>
			<Flex justifyContent="end" mb={2} width={1}>
				{showNewMessageForm ? (
					<UserRequestDetailNewMessageForm
						detail={detail}
						afterSubmit={() => {
							setShowNewMessageForm(false);
							refetchDetail();
						}}
						onCancel={() => setShowNewMessageForm(false)}
					/>
				) : (
					<Button onClick={() => setShowNewMessageForm(true)} variant="primary">
						{' '}
						+ Nová zpráva
					</Button>
				)}
			</Flex>
			{detail.messages.map((msg, index) => (
				<Box key={`msg-${msg.id}-${index}`}>
					<Box
						bg="white"
						p={2}
						mb={3}
						css={css`
							box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.02);
						`}
					>
						<Text>{msg.message}</Text>
						<Divider my={3} />
						{msg.files.length > 0 && (
							<Flex mt={2} fontWeight="bold">
								<Text mr={2}>Přílohy:</Text>
								{msg.files.map((file, index) => (
									<Chip
										css={css`
											&:hover {
												cursor: pointer;
												filter: brightness(0.95);
											}
										`}
										onClick={async () => {
											try {
												const response = await getUserRequestFiles(
													detail.id,
													file.id,
												);
												const blob = await response.blob();
												const url = URL.createObjectURL(blob);
												downloadFile(url, file.name);
											} catch (error) {
												toast.error('Unable to download file.');
												console.log(error);
											}
										}}
										py={1}
										px={2}
										mr={1}
										key={`files-${file.id}-${index}`}
									>
										<Flex color="primary" alignItems="center">
											<Text as="span" mr={2}>
												{file.name}
											</Text>
											<MdDownload />
										</Flex>
									</Chip>
								))}
							</Flex>
						)}
					</Box>
				</Box>
			))}
		</Box>
	);
};
