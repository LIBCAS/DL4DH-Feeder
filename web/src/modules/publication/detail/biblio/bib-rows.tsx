import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Author, Metadata } from 'components/kramerius/model/metadata.model';
import { Box } from 'components/styled';
import Text from 'components/styled/Text';
import { NavLinkButton } from 'components/styled/Button';

import { FormattedBibliohraphy } from 'hooks/useMetadata';

import AuthorsDialog from '../AuthorsDialog';
import { BibLink } from '../PubBiblioDetail';

export const BibAuthors: FC<{
	mainAuthors: Author[];
	otherAuthors: Author[];
	metadata: Metadata;
}> = ({ mainAuthors, otherAuthors, metadata }) => {
	const { t } = useTranslation();
	if (mainAuthors.length === 0 && otherAuthors.length === 0) {
		return <></>;
	}

	return (
		<Box mb={3}>
			{mainAuthors.length > 0 && (
				<>
					<>
						<Text fontSize="13.5px" color="#9e9e9e">
							{t('metadata:author')}
						</Text>
						{mainAuthors.map(a => (
							<BibLink
								key={a.name}
								to={`/search?authors=${a.name}`}
								label={a.name}
							/>
						))}
					</>

					<Box>
						<AuthorsDialog metadata={metadata} />
					</Box>
				</>
			)}

			{otherAuthors.length > 0 && (
				<>
					<Text fontSize="13.5px" color="#9e9e9e">
						{t('metadata:author_other')}
					</Text>
					{otherAuthors.map(a => (
						<div key={a.name}>
							<BibLink to={`/search?authors=${a.name}`} label={a.name} />
						</div>
					))}
					<Box>
						<AuthorsDialog metadata={metadata} />
					</Box>
				</>
			)}
		</Box>
	);
};

const PartsInfo: FC<Pick<FormattedBibliohraphy, 'parts'>> = ({ parts }) => {
	if (!parts?.mainPartName && !parts?.mainPartNumber) {
		return <></>;
	}
	return (
		<Text color="#616161" fontSize="15px">
			{parts?.label ?? ''} {parts?.mainPartNumber ?? ''}
			{'. '}
			{parts?.mainPartName ?? ''}
		</Text>
	);
};

const mapContextToUnitType = {
	monograph: 'unit_list',
	periodical: 'volume_list',
	periodicalvolume: 'issue_list',
};
export const BibRootInfo: FC<{ formatted: FormattedBibliohraphy[] }> = ({
	formatted,
	children,
}) => {
	const root = formatted?.[0];

	const isPeriodical =
		root?.model === 'periodical' ||
		root?.model === 'periodicalvolume' ||
		formatted.slice(1).find(f => f?.model === 'monographunit');
	const { t } = useTranslation();

	if (!root) {
		return <></>;
	}
	const bg = `rgba(${Math.random() * 20 + 235}, ${Math.random() * 20 + 235}, ${
		Math.random() * 20 + 235
	})`;

	return (
		<Box pl={4} bg={bg}>
			{root.model}
			<Box mb={3}>
				<Text color="#616161" fontSize="16.5px" fontWeight="bold">
					{root?.titles?.mainTitle ?? ''}
				</Text>
				<Text color="#616161" fontSize="15px">
					{root?.titles?.mainSubTitle ?? ''}
				</Text>
				<PartsInfo parts={root.parts} />
				{isPeriodical && (
					<Box>
						<NavLinkButton
							to={`/periodical/${root.pid}`}
							variant="text"
							color="textCommon"
							fontWeight="bold"
							px={0}
						>
							{t(`metadata:${mapContextToUnitType[root.model]}`)}
						</NavLinkButton>
					</Box>
				)}
			</Box>
			<BibAuthors
				mainAuthors={root.authors.primaryAuthors}
				otherAuthors={root.authors.otherAutors}
				metadata={root.metadata}
			/>
			{children}

			<Box mb={3}>
				{root.data.map((field, index) => {
					return (
						<Box mb={3} key={`${field.id}-${index}`}>
							{field.data
								.filter(d => d.value.length > 0)
								.map(d => {
									return (
										<Box key={`${field.id}-${index}-${d.label}-${d.value}`}>
											<Text fontSize="13.5px" color="#9e9e9e">
												{d.label}
											</Text>
											{d.link ? (
												<>
													{d.value.map((linkLabel, itemIndex) => (
														<BibLink
															key={linkLabel}
															to={d.getLink(itemIndex)}
															label={linkLabel}
														/>
													))}
												</>
											) : (
												<Box>
													{d.value.map((label, itemIndex) => (
														<Box key={`not-link-${label}-${itemIndex}`}>
															<b>{label}</b>
														</Box>
													))}
												</Box>
											)}
										</Box>
									);
								})}
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};
