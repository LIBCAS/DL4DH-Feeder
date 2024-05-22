/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import { MdDownload } from 'react-icons/md';

import { Chip } from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';

import { UserRequestDto } from 'models/user-requests';

export const UserRequestDetailMessages: FC<{ detail: UserRequestDto }> = ({
	detail,
}) => {
	return (
		<Box
			p={3}
			bg="paper"
			css={css`
				max-height: 500px;
				overflow-y: auto;
				box-shadow: inset 0px 3px 6px 2px rgba(0, 0, 0, 0.05);
			`}
		>
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
										onClick={() => console.log({ file })}
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
