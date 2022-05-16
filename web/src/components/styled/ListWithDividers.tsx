import React, { FC, Fragment } from 'react';

type Props = {
	divider: JSX.Element;
	children: JSX.Element[];
};

const ListWithDividers: FC<Props> = ({ children, divider }) => (
	<>
		{children.map((c, i) => (
			<Fragment key={c.key ?? undefined}>
				{i > 0 && divider}
				{c}
			</Fragment>
		))}
	</>
);
export default ListWithDividers;
