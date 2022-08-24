import React, { FC, useState } from 'react';

type TooltipContextType = {
	isDisplayed: boolean;
	displayMsg: (
		msg: string,
		clientX: number,
		clientY: number,
		rect?: DOMRect,
	) => void;
	setPosition: (x: number, y: number) => void;
	onClose: () => void;
	rect: DOMRect | undefined;
	msg: string;
	clientX: number;
	clientY: number;
};

const TooltipContext = React.createContext<TooltipContextType>(
	undefined as never,
);
export default TooltipContext;

export const TooltipContextProvider: FC = ({ children }) => {
	const [msg, setMsg] = useState('');
	const [clientX, setClientX] = useState(0);
	const [clientY, setClientY] = useState(0);
	const [rect, setRect] = useState<DOMRect | undefined>();
	const [isDisplayed, setIsDisplayed] = useState(false);
	const displayHandler = (
		msg: string,
		clientX: number,
		clientY: number,
		rect: DOMRect | undefined,
	) => {
		setMsg(msg);
		setRect(rect);
		setClientX(clientX);
		setClientY(clientY);
		setIsDisplayed(true);
		return null;
	};
	const closeHandler = () => {
		//clearTimeout(timer);
		setIsDisplayed(false);
		return null;
	};

	const setPosition = (x: number, y: number) => {
		setClientX(x);
		setClientY(y);
		return null;
	};

	return (
		<TooltipContext.Provider
			value={{
				msg,
				isDisplayed,
				displayMsg: displayHandler,
				onClose: closeHandler,
				setPosition,
				clientX,
				clientY,
				rect,
			}}
		>
			{children}
		</TooltipContext.Provider>
	);
};
