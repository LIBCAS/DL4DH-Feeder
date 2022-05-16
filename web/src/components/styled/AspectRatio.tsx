import React, { ComponentProps, FC } from 'react';

import { Box, Grid } from 'components/styled';

type Props = {
	ratio: [number, number];
} & ComponentProps<typeof Grid>;

const AspectRatio: FC<Props> = ({ ratio: [w, h], children, ...props }) => (
	<Grid justifyContent="stretch" alignItems="stretch" {...props}>
		<svg viewBox={`0 0 ${w} ${h}`} style={{ gridArea: '1/1/2/2' }} />
		<Box gridArea="1/1/2/2">{children}</Box>
	</Grid>
);

export default AspectRatio;
