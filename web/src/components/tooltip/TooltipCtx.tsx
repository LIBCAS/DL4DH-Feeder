import React, { FC, useState } from 'react';

import { DEV_ENV } from 'utils/enumsMap';

const TOOLTIP_DEBUG_MODE_ON = DEV_ENV ? true : false;
const TOOLTIP_DELAY_TIME = 400; // ms

type TooltipContextType = {
	isDisplayed: boolean;
	displayMsg: (msg: string, rect?: DOMRect, delay?: number) => void;
	onClose: () => void;
	rect: DOMRect | undefined;
	msg: string;
	debugMode?: boolean;
	msgDisplayDelay: number;
	rectCustomOffset?: { top?: number; left?: number }; //TODO: na pripadne posunutie, napr dole
};

const TooltipContext = React.createContext<TooltipContextType>(
	undefined as never,
);
export default TooltipContext;

export const TooltipContextProvider: FC = ({ children }) => {
	const [msg, setMsg] = useState('');
	const [msgDisplayDelay, setMsgDisplayDelay] = useState(TOOLTIP_DELAY_TIME);
	const [rect, setRect] = useState<DOMRect | undefined>();
	const [isDisplayed, setIsDisplayed] = useState(false);
	const displayMsg = (
		msg: string,
		rect: DOMRect | undefined,
		delay?: number,
	) => {
		if (TOOLTIP_DEBUG_MODE_ON) {
			console.log({ rect });
		}
		if (delay) {
			setMsgDisplayDelay(delay);
		} else {
			setMsgDisplayDelay(TOOLTIP_DELAY_TIME);
		}
		setMsg(msg);
		setRect(rect);
		setIsDisplayed(true);
	};
	const onClose = () => {
		setIsDisplayed(false);
	};

	return (
		<TooltipContext.Provider
			value={{
				msg,
				isDisplayed,
				displayMsg,
				onClose,
				rect,
				debugMode: TOOLTIP_DEBUG_MODE_ON,
				msgDisplayDelay,
			}}
		>
			{children}
		</TooltipContext.Provider>
	);
};
