/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import React, { FC } from 'react';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { Chip } from '../input/TextInput';

type Props = {
	items: {
		key: string;
		name: string | React.ReactNode;
		onClick: () => void;
		value?: string | number;
	}[];
	onReset: () => void;
	refresh: () => void;
};

const ActiveFilters: FC<Props> = ({ items, refresh }) => {
	return (
		<Flex
			flexDirection={['column', 'row']}
			alignItems={['stretch', 'baseline']}
			mt={1}
			mb={1}
			py={items.length > 0 ? undefined : 0}
			css={css`
				transition: max-height 1s ease-in-out;
				max-height: ${items.length > 0 ? '1000px' : '0'};
				/* overflow: hidden; */
			`}
		>
			<Flex
				flexShrink={0}
				ml={2}
				// mr={[0, 4, 5]}
				alignItems="center"
				css={css`
					visibility: ${items?.length > 0 ? 'visible' : 'hidden'};
				`}
			>
				<Text color="textLight">Zvolené filtry:</Text>
			</Flex>
			<Flex flexWrap="wrap">
				{items.map(i => (
					<Chip
						key={i.key}
						onClose={() => {
							i.onClick();
							refresh();
						}}
						ml={2}
						mb={2}
						p={2}
					>
						{i.name}
						{i.value ? `: ${i.value}` : ''}
					</Chip>
				))}
			</Flex>

			{/* {items?.length > 0 && (
				<Flex
					flexGrow={1}
					flexShrink={0}
					alignItems="flex-start"
					justifyContent="flex-end"
					order={[-1, 0]}
					height={[0, 'unset']}
					zIndex={1}
				>
					<Chip onClose={onReset}>Zrušit filtry</Chip>
				</Flex>
			)} */}
		</Flex>
	);
};
export default ActiveFilters;
