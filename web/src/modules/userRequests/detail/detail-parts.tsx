/** @jsxImportSource @emotion/react */

import { css } from '@emotion/core';
import { FC } from 'react';
import { MdDownload } from 'react-icons/md';

import { Chip } from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';

import { useTheme } from 'theme';
import { UserRequestDto, UserRequestPartDto } from 'models/user-requests';
import { TableColumn } from 'models/common';

const columns: TableColumn<UserRequestPartDto>[] = [
	{ datakey: 'publicationId', visible: true, flex: 3, label: 'Publikace' },
	{ datakey: 'state', visible: true, flex: 2, label: 'Stav' },
	{ datakey: 'note', visible: true, flex: 3, label: 'Poznámka' },
];

export const UserRequestDetailParts: FC<{ detail: UserRequestDto }> = ({
	detail,
}) => {
	const theme = useTheme();
	return (
		<Box
			p={3}
			css={css`
				border: 1px solid ${theme.colors.border};
				max-height: 500px;
				overflow-y: auto;
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
						<Flex mt={2}>
							<Text mr={2}>Prílohy:</Text>
							{msg.files.map((file, index) => (
								<Chip
									css={css`
										&:hover {
											cursor: pointer;
										}
									`}
									onClick={() => console.log({ file })}
									py={1}
									px={2}
									mr={1}
									key={`files-${file.id}-${index}`}
								>
									{file.name}
									<MdDownload />
								</Chip>
							))}
						</Flex>
					</Box>
				</Box>
			))}
		</Box>
	);
};
