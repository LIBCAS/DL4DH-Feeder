import { Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';

import BibMain from 'modules/publication/detail/biblio/bib-main';

// povodne
// uuid:21426150-9e46-11dc-a259-000d606f5dc6

// uuid kapitoly
// uuid:10367700-a71c-11dc-9cac-000d606f5dc6

// kniha zo zvazku
// uuid:26895750-1c70-11e8-a0cf-005056827e52

// stranka zo zvazku, obsahuje aj partName a partNumber (parent - monounit)

// zlozitejsie periodikum
// uuid:de7d7b20-4e02-11ed-a50c-005056825209

const TestApp = () => {
	return (
		<Flex flexDirection="column">
			<Flex>
				<NavLinkButton to="/uuid:26895750-1c70-11e8-a0cf-005056827e52">
					Kniha zo zvazku
				</NavLinkButton>
				<NavLinkButton
					to="/uuid:de7d7b20-4e02-11ed-a50c-005056825209
"
				>
					Zlozitejsie periodikum
				</NavLinkButton>
				<NavLinkButton to="/uuid:a9759e30-42d6-4a91-846f-4b636b4066ed">
					Kapitola
				</NavLinkButton>
			</Flex>
			<BibMain variant="right" />
		</Flex>
	);
};

export default TestApp;
