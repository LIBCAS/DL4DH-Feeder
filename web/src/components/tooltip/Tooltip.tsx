/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import React, { FC, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import useMeasure from 'react-use-measure';

import { Box } from 'components/styled';

import useViewport from 'hooks/useViewport';

import TooltipContext from './TooltipCtx';

import './tooltip.css';

const TooltipRender = () => {
	const TooltipCtx = useContext(TooltipContext);
	const [ref, { width: tooltipWidth, height: tooltipHeight }] = useMeasure({
		debounce: 10,
	});
	const { width: clientWidth, height: clientHeight } = useViewport();

	const { rect } = TooltipCtx;

	//const left = tooltipWidth + X >= clientWidth ? clientWidth - tooltipWidth : X;
	const left = (rect?.left ?? 0) + (rect?.width ?? 0) + 10;
	const top = rect?.top ?? 0;
	const alignedLeft =
		left + tooltipWidth >= clientWidth ? clientWidth - tooltipWidth - 20 : left;
	const alignedTopHorizontal =
		left !== alignedLeft ? top + (rect?.height ?? 0) + 10 : top;
	const alignedTop =
		alignedTopHorizontal + tooltipHeight >= clientHeight
			? clientHeight - tooltipHeight - 20
			: alignedTopHorizontal;

	return ReactDOM.createPortal(
		<Box
			ref={ref}
			className="tooltip-container"
			style={{
				cursor: 'pointer',
				position: 'absolute',
				zIndex: 9999,
				top: alignedTop,
				left: alignedLeft,
				backgroundColor: 'grey',
				color: 'white',
				padding: 8,
			}}
			css={css`
				box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.2);
			`}
		>
			{TooltipCtx.msg}
		</Box>,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		document.getElementById('tooltip-root')!,
	);
};
export default TooltipRender;

export const TooltipTrigger: FC<{ tooltip?: string }> = ({ tooltip }) => {
	const tooltipCtx = useContext(TooltipContext);
	const ref = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={ref}
			onMouseEnter={e => {
				const rect = ref.current?.getBoundingClientRect();
				tooltipCtx.displayMsg(tooltip ?? '', 0, 0, rect);
			}}
			onMouseLeave={() => {
				tooltipCtx.onClose();
			}}
			css={css`
				position: absolute;
				width: 100%;
				height: 100%;
				top: ${0}px;
				left: ${0}px;
				overflow: hidden;
				background-color: red;
				opacity: 0;
				z-index: 9999;
			`}
		></div>
	);
};
