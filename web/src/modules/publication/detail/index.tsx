/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { Flex } from 'components/styled';
import { ResponsiveWrapper, Wrapper } from 'components/styled/Wrapper';

import { useTheme } from 'theme';

import DetailLeftMenu from './DetailLeftMenu';

const PublicationDetail = () => {
	const theme = useTheme();

	return (
		<ResponsiveWrapper
			bg="primaryLight"
			px={1}
			mx={0}
			alignItems="flex-start"
			width={1}
		>
			<Flex
				bg="white"
				width={1}
				height={50}
				alignItems="center"
				css={css`
					border-bottom: 1px solid ${theme.colors.border};
				`}
			>
				Pub detail
				<a href="https://github.com/gerhardsletten/react-pinch-zoom-pan?ref=morioh.com&utm_source=morioh.com">
					https://github.com/gerhardsletten/react-pinch-zoom-pan?ref=morioh.com&utm_source=morioh.com
				</a>
			</Flex>
			<Flex width={1}>
				<DetailLeftMenu />
				<Flex
					m={3}
					width={1}
					bg="lightGrey"
					alignItems="center"
					position="relative"
					css={css`
						border: 1px solid ${theme.colors.border};
					`}
				>
					<TransformWrapper
						initialScale={0.1}
						limitToBounds={false}
						minScale={0.1}
						maxScale={3}
					>
						<TransformComponent>
							<img src="pubtest.jpg" alt="test" />
						</TransformComponent>
					</TransformWrapper>
				</Flex>
			</Flex>
		</ResponsiveWrapper>
	);
};
export default PublicationDetail;
