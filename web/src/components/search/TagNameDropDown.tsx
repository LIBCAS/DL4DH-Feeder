/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

import Text from 'components/styled/Text';
import { Flex } from 'components/styled';
import SimpleSelect, { ClickAway } from 'components/form/select/SimpleSelect';

import { theme } from 'theme';

import { TagNameEnum } from 'api/models';

import { fieldsTuple, operationsTuple } from 'hooks/useSearchContext';

import { NameTagToText, NameTagIcon } from 'utils/enumsMap';

import { OperationToTextLabel, OperationToWord } from './MainSearchInput';
type Props = {
	x?: void;
};

const TagNameDropDown: React.FC<Props> = () => {
	const [localState, setLocalState] = useState('');
	const [showTagNameMenu, setShowTagNameMenu] = useState(false);
	const [showTagOpMenu, setShowTagOpMenu] = useState(false);
	const [selectedTagName, setSelectedTagName] = useState<TagNameEnum | null>(
		null,
	);
	const [selectedTagOp, setSelectedTagOp] = useState<
		'EQUAL' | 'NOT_EQUAL' | null
	>(null);

	const [searchParams, setSearchParams] = useSearchParams();
	const nav = useNavigate();
	const location = useLocation();

	return (
		<Flex width={1}>
			<ClickAway onClickAway={() => setShowTagNameMenu(false)}>
				<SimpleSelect
					value={selectedTagName}
					options={[...fieldsTuple, null]}
					onChange={field => {
						setShowTagNameMenu(false);
						setShowTagOpMenu(true);
						if (field) {
							setSelectedTagName(field);
						}
					}}
					keyFromOption={item => (item ? item : '')}
					nameFromOption={item => (item ? NameTagToText[item] : '')}
					renderMenuItem={(item, currentValue) => {
						if (!item) {
							return <></>;
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
					placeholder="Zvolte nametag"
					zIndex={5}
					menuFixedSize
					wrapperCss={css`
						width: 230px;
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
			{selectedTagName && (
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
