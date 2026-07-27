import { useTranslation } from 'react-i18next';

import Paper from 'components/styled/Paper';
import { Wrapper } from 'components/styled/Wrapper';

import { useEffect, useState } from 'react';

const Manual = () => {
	const [pageContent, setPageContent] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { t, i18n } = useTranslation('export');
	const fileName = '/pages/'+i18n.language+'/manual.html';

	useEffect(() => {
		fetch(fileName)
			.then((response) => {
				if (!response.ok) {
					throw new Error(t('download_error'));
				}
				return response.text();
			})
			.then((data) => {
				setPageContent(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [fileName]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
	
	return (
		<Wrapper
			height="100vh"
			alignItems="flex-start"
			p={[4, 0]}
			width={1}
			bg="paper"
		>
			<Paper
				color="#444444!important"
				maxWidth="1350px"
				marginRight="auto"
				marginLeft="auto"
				style={{ height: 'calc(-90px + 100vh)', overflow: "hidden auto" }}
			>
				<div dangerouslySetInnerHTML={{ __html: pageContent }} />
			</Paper>
		</Wrapper>
	);
};

export default Manual;
