import { FC, useMemo, useState } from 'react';

import { Box } from 'components/styled';
import Button, { NavLinkButton } from 'components/styled/Button';
import Divider from 'components/styled/Divider';
import Text from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';

import { Loader } from 'modules/loader';
import { useParseUrlIdsAndParams } from 'modules/publication/publicationUtils';

import {
	usePublicationChildren,
	usePublicationDetail,
} from 'api/publicationsApi';
import { PublicationContext } from 'api/models';

const getParentPid = (context: PublicationContext[], pid?: string) => {
	if (!pid || pid === '') {
		return undefined;
	}
	const currentIndex = context.flat().findIndex(c => c.pid === pid);
	if (currentIndex < 0 || currentIndex - 1 < 0) {
		return undefined;
	}
	return context.flat()?.[currentIndex - 1]?.pid ?? undefined;
};

type Props = {
	isSecond?: boolean;
};

const BibInternalParts: FC<Props> = ({ isSecond }) => {
	const { getApropriateIds } = useParseUrlIdsAndParams();
	const { id } = getApropriateIds(isSecond);
	const currentDetail = usePublicationDetail(id);
	const response = usePublicationChildren(id);
	const [open, setOpen] = useState(false);
	const children = useMemo(
		() => response?.data?.filter(ch => ch.model === 'internalpart'),
		[response?.data],
	);

	if (response.isLoading || currentDetail.isLoading) {
		return <Loader />;
	}

	if (currentDetail.data?.model === 'internalpart') {
		return (
			<Wrapper m={3}>
				<NavLinkButton
					fontWeight="bold"
					variant="text"
					textAlign="left"
					to={`/view/${getParentPid(currentDetail.data.context, id)}`}
				>
					Přejít na celou publikaci
				</NavLinkButton>
			</Wrapper>
		);
	}

	if (!children || children?.length === 0) {
		return <></>;
	}

	return (
		<Wrapper p={3}>
			<Button variant="primary" onClick={() => setOpen(p => !p)}>
				{open ? 'Skrýt kapitoly' : 'Zobrazit kapitoly'}
			</Button>

			{open && (
				<Wrapper>
					<Text color="#616161" fontSize="16.5px" fontWeight="bold">
						Kapitoly
					</Text>

					{children?.map(ch => (
						<Box key={ch.pid}>
							<NavLinkButton
								color="text"
								fontSize="md"
								variant="text"
								textAlign="left"
								to={`/view/${ch.pid}`}
							>
								{ch.title}
							</NavLinkButton>
							<Divider />
						</Box>
					))}
				</Wrapper>
			)}
		</Wrapper>
	);
};

export default BibInternalParts;
