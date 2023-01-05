import { useTranslation } from 'react-i18next';
import { FC } from 'react';

import Button from 'components/styled/Button';

import { CZFlagIcon, ENFlagIcon } from 'assets';

type Props = {
	variant: string;
};

const LangSwitch: FC<Props> = ({ variant }) => {
	const { i18n, t } = useTranslation('lang');

	return (
		<Button
			color={variant === 'desktop' ? 'white' : 'primary'}
			variant={variant === 'desktop' ? 'primary' : 'text'}
			fontSize={variant === 'desktop' ? 12 : 18}
			tooltip={i18n.language === 'en' ? t('cs') : t('en')}
			minWidth={30}
			px={1}
			mr={variant === 'desktop' ? 1 : 'initial'}
			my={variant === 'desktop' ? 'initial' : 2}
			onClick={() =>
				i18n.language === 'en'
					? i18n.changeLanguage('cz')
					: i18n.changeLanguage('en')
			}
		>
			{variant === 'desktop' ? (
				<>
					{i18n.language === 'en' ? (
						<CZFlagIcon size={24} />
					) : (
						<ENFlagIcon size={24} />
					)}
				</>
			) : (
				<>{i18n.language === 'en' ? t('cs') : t('en')}</>
			)}
			{/* <ENFlagIcon size={180} /> */}
		</Button>
	);
};

export default LangSwitch;
