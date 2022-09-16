/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';

import Text from 'components/styled/Text';
import { Flex } from 'components/styled';
import SimpleSelect, { ClickAway } from 'components/form/select/SimpleSelect';

import { theme } from 'theme';

import { TagNameEnum } from 'api/models';

import { fieldsTuple, operationsTuple } from 'hooks/useSearchContext';

import { NameTagToText, NameTagIcon } from 'utils/enumsMap';

import { OperationToTextLabel, OperationToWord } from './MainSearchInput';
type Props = {
	withOperation?: boolean;
	selectedItemView?: 'ICON' | 'TEXT';
	onTagNameSelected: (tagName: TagNameEnum | null) => void;
	selectedNameTag: TagNameEnum | null;
};

const TagNameDropDown: React.FC<Props> = ({
	onTagNameSelected,
	withOperation,
	selectedItemView = 'ICON',
	selectedNameTag,
}) => {
	const [showTagNameMenu, setShowTagNameMenu] = useState(false);
	const [showTagOpMenu, setShowTagOpMenu] = useState(false);

	const [selectedTagOp, setSelectedTagOp] = useState<
		'EQUAL' | 'NOT_EQUAL' | null
	>(null);

	return (
		<Flex width={1}>
			<ClickAway onClickAway={() => setShowTagNameMenu(false)}>
				<SimpleSelect
					value={selectedNameTag}
					options={[null, ...fieldsTuple]}
					onChange={field => {
						setShowTagNameMenu(false);
						setShowTagOpMenu(true);

						onTagNameSelected(field);
					}}
					keyFromOption={item => (item ? item : '')}
					nameFromOption={item => (item ? NameTagToText[item] : '')}
					renderSelectedItem={
						selectedItemView === 'ICON'
							? (item, nameFromOption) => {
									if (item) {
										const Icon = NameTagIcon[item];
										return <Icon title={nameFromOption(item)} size={24} />;
									} else {
										return <></>;
									}
							  }
							: undefined
					}
					renderMenuItem={(item, currentValue) => {
						if (!item) {
							return currentValue ? (
								<Flex px={1} py={1} alignItems="center">
									<MdClose size={22} />
									<Text
										fontWeight={item === currentValue ? 'bold' : 'normal'}
										ml={2}
									>
										SMAZAT
									</Text>
								</Flex>
							) : (
								<></>
							);
						}
						const Icon = NameTagIcon[item];
						return (
							<Flex
								px={1}
								py={1}
								alignItems="center"
								color={item === currentValue ? 'primary' : 'unset'}
							>
								<Icon size={22} />
								<Text
									fontWeight={item === currentValue ? 'bold' : 'normal'}
									ml={2}
								>
									{' '}
									{NameTagToText[item]}
								</Text>
							</Flex>
						);
					}}
					placeholder="--"
					zIndex={5}
					menuFixedSize
					wrapperCss={css`
						width: 50px;
						color: ${theme.colors.primary};
						border: none;
						flex-shrink: 0;
					`}
					menuItemCss={css`
						padding-left: 16px;
						padding-right: 16px;
						min-width: 200px;
					`}
				/>
			</ClickAway>
			{withOperation && selectedNameTag && (
				<ClickAway onClickAway={() => setShowTagOpMenu(false)}>
					<SimpleSelect
						isExpanded={showTagOpMenu}
						value={selectedTagOp}
						options={operationsTuple}
						onChange={operation => {
							setShowTagOpMenu(false);
							setSelectedTagOp(operation);

							//mainInputRef.current?.focus();
						}}
						keyFromOption={item => (item ? OperationToTextLabel[item] : '')}
						width={70}
						arrowHidden
						menuFixedSize
						nameFromOption={item => (item ? OperationToTextLabel[item] : '')}
						renderMenuItem={(item, currentValue) => {
							if (!item) {
								return <></>;
							}

							return (
								<Flex
									px={1}
									py={1}
									alignItems="center"
									color={item === currentValue ? 'primary' : 'unset'}
								>
									<Text fontWeight={item === currentValue ? 'bold' : 'normal'}>
										{OperationToTextLabel[item]}
									</Text>
									<Text ml={4}>{OperationToWord[item]}</Text>
								</Flex>
							);
						}}
						wrapperCss={css`
							width: 70px;
							/* font-size: ${theme.fontSizes.xl}px; */
							font-size: 22px !important;
							border: none;
							background: ${theme.colors.primaryLight};
							justify-content: center;
							margin-left: 2px;
							margin-right: 2px;
						`}
						menuItemCss={css`
							padding-left: 16px;
							padding-right: 16px;
							font-size: 16px !important;
						`}
					/>
				</ClickAway>
			)}
		</Flex>
	);
};
export default TagNameDropDown;
