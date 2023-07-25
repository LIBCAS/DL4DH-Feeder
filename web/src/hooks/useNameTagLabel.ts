import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

import { TagNameEnum } from 'api/models';

export default function useNameTagLocalizedLabel() {
	const { t } = useTranslation();
	return useCallback(
		(nameTag: TagNameEnum): string => t(`nametag:labels.${nameTag}`),
		[t],
	);
}
