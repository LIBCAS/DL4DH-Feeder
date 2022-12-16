import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose, MdOutlineMore } from 'react-icons/md';

import { Metadata } from 'components/kramerius/model/metadata.model';
import ModalDialog from 'components/modal';
import { Flex } from 'components/styled';
import Button, { NavLinkButton } from 'components/styled/Button';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H5 } from 'components/styled/Text';
import ClassicTable from 'components/table/ClassicTable';

const AuthorsDialog: FC<{ metadata?: Metadata }> = ({ metadata }) => {
	const { t } = useTranslation('authors-dialog');
	const data = (metadata?.authors ?? []).map((a, i) => ({
		id: i.toString(),
		name: a.name,
		role: a.roles,
		date: a.date,
	}));
	return (
		<ModalDialog
			label="Authors"
			control={openModal => (
				<IconButton onClick={openModal} color="#9e9e9e">
					<MdOutlineMore size={18} />
				</IconButton>
			)}
		>
			{closeModal => (
				<Paper>
					<Flex width={1} justifyContent="space-between" alignItems="center">
						<H5 my={2}>{t('title')}</H5>
						<IconButton color="primary" onClick={closeModal}>
							<MdClose size={20} />
						</IconButton>
					</Flex>
					<ClassicTable
						data={data}
						renderRow={({ date, name, role }) => (
							<Flex width={1} px={3} alignItems="center">
								<Flex flex={2}>
									<NavLinkButton
										my={0}
										mx={0}
										px={0}
										variant="text"
										to={`/search?authors=${name}`}
										fontSize="md"
									>
										{name}
									</NavLinkButton>
								</Flex>
								<Flex flex={2} m={0}>
									<Text>{date}</Text>
								</Flex>
								<Flex flex={2} m={0}>
									<Text>{t(`relator:${role}`)}</Text>
								</Flex>
							</Flex>
						)}
						minWidth={100}
						headerHeight={32}
						renderHeader={() => (
							<Flex width={1} px={3} alignItems="center">
								<Flex flex={2} m={0}>
									<Text>{t('name')}</Text>
								</Flex>
								<Flex flex={2} m={0}>
									<Text>{t('date')}</Text>
								</Flex>
								<Flex flex={2} m={0}>
									<Text>{t('role')}</Text>
								</Flex>
							</Flex>
						)}
						hideEditButton
					/>
					<Flex justifyContent="flex-end" mt={2}>
						<Button px={1} variant="text" onClick={closeModal}>
							{t('common:close')}
						</Button>
					</Flex>
				</Paper>
			)}
		</ModalDialog>
	);
};

export default AuthorsDialog;
