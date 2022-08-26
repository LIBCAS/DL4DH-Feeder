/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import useMeasure from 'react-use-measure';

import { Box } from 'components/styled';

import useViewport from 'hooks/useViewport';

import TooltipContext from './TooltipCtx';

const TooltipRender = () => {
	const TooltipCtx = useContext(TooltipContext);
	const [ref, { width: tooltipWidth, height: tooltipHeight }] = useMeasure({
		debounce: 10,
	});
	const { width: clientWidth, height: clientHeight } = useViewport();

	const { rect } = TooltipCtx;

	if (!TooltipCtx.isDisplayed) {
		return <></>;
	}

	//const left = tooltipWidth + X >= clientWidth ? clientWidth - tooltipWidth : X;
	const left = (rect?.left ?? 0) + (rect?.width ?? 0) + 10;
	const top = rect?.top ?? 0;
	const alignedLeft =
		left + tooltipWidth >= clientWidth ? clientWidth - tooltipWidth - 20 : left;
	const alignedTopHorizontal =
		left !== alignedLeft ? top + (rect?.height ?? 0) + 10 : top;
	const alignedTop =
		alignedTopHorizontal + tooltipHeight >= clientHeight
			? clientHeight - tooltipHeight - 50
			: alignedTopHorizontal;

	if (TooltipCtx.debugMode) {
		console.log({ alignedLeft, alignedTop });
	}

	return ReactDOM.createPortal(
		<Box
			ref={ref}
			css={css`
				@keyframes slide-up {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				opacity: 0;
				animation: 500ms ease forwards slide-up;
				animation-delay: ${TooltipCtx.msgDisplayDelay}ms;
				box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2);
				border: 1px solid #444;
				border-radius: 3%;
				cursor: pointer;
				position: absolute;
				z-index: 9999;
				top: ${alignedTop}px;
				left: ${alignedLeft}px;
				background-color: #444;
				color: white;
				padding: 8px;
				max-width: 250px;
			`}
		>
			{TooltipCtx.msg}
		</Box>,

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		document.getElementById('tooltip-root')!,
	);
};
export default TooltipRender;

export const TooltipTrigger: FC<{ tooltip?: string; tooltipDelay?: number }> =
	({ tooltip, tooltipDelay }) => {
		const tooltipCtx = useContext(TooltipContext);
		const ref = useRef<HTMLDivElement>(null);

		return (
			<div
				ref={ref}
				onMouseEnter={() => {
					if (tooltipCtx.debugMode) {
						console.log('onMouseEnter', tooltipCtx.msg);
					}
					const rect = ref.current?.getBoundingClientRect();
					setTimeout(
						() => tooltipCtx.displayMsg(tooltip ?? '', rect, tooltipDelay),
						1,
					);
				}}
				onMouseLeave={() => {
					if (tooltipCtx.debugMode) {
						console.log('onMouseLeave', tooltipCtx.msg);
					}
					tooltipCtx.onClose();
				}}
				onMouseOut={() => {
					if (tooltipCtx.debugMode) {
						console.log('onMouseOut', tooltipCtx.msg);
					}
					tooltipCtx.onClose();
				}}
				//onMouseOut
				onClick={() => tooltipCtx.onClose()}
				css={css`
					cursor: inherit;
					position: absolute;
					width: 100%;
					height: 100%;
					top: ${0}px;
					left: ${0}px;
					overflow: hidden;
					background: ${tooltipCtx.debugMode ? 'red' : 'transparent'};
					opacity: ${tooltipCtx.debugMode ? 0.1 : 0};
					z-index: 999;
				`}
			></div>
		);
	};
