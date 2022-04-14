import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled/macro';

import { Box } from 'components/styled';

import { ReactComponent as ThreeDots } from './svg/dots.svg';
import { ReactComponent as Profile } from './profile-icon.svg';
import { ReactComponent as ArrowRight } from './svg/arrow-right.svg';
import { ReactComponent as ArrowLeft } from './svg/arrow-left.svg';
import { ReactComponent as ArrowUp } from './svg/arrow-up.svg';
import { ReactComponent as Search } from './svg/search.svg';
import { ReactComponent as Reset } from './svg/reset.svg';
import { ReactComponent as MobileMenu } from './svg/menu-lines.svg';
import { ReactComponent as Cross } from './svg/cross.svg';
import { ReactComponent as Capture } from './svg/capture.svg';
import { ReactComponent as Calendar } from './svg/calendar.svg';

const Icon = styled(Box, { shouldForwardProp: isPropValid })``;

export const ProfileIcon = Icon.withComponent(Profile);
export const ArrowRightIcon = Icon.withComponent(ArrowRight);
export const ArrowLeftIcon = Icon.withComponent(ArrowLeft);
export const ArrowUpIcon = Icon.withComponent(ArrowUp);
export const ThreeDotsIcon = Icon.withComponent(ThreeDots);
export const SearchIcon = Icon.withComponent(Search);
export const ResetIcon = Icon.withComponent(Reset);
export const MobileMenuIcon = Icon.withComponent(MobileMenu);
export const CrossIcon = Icon.withComponent(Cross);
export const CaptureIcon = Icon.withComponent(Capture);
export const CalendarIcon = Icon.withComponent(Calendar);

export const ArrowDownIcon = styled(Box, {
	shouldForwardProp: isPropValid,
})`
	transform: rotate(180deg);
`.withComponent(ArrowUp);
