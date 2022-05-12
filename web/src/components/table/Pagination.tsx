import { FC, useEffect } from 'react';

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text from 'components/styled/Text';

import { ArrowLeftIcon, ArrowRightIcon } from 'assets';
import { theme } from 'theme';

import Store from 'utils/Store';

const pageLimitOptions = [15, 30, 50, 100, -1];
const nameFromOption = (n: number) => (n !== -1 ? n : 'Všetko');

const selectStyle = {
	fontFamily: 'Roboto',
	fontSize: '16px',
	color: theme.colors.primary,
};

type Props = {
	changeLimit: (newLimit: number) => void;
	pageLimit: number;
	changePage: (page: number) => void;
	page: number;
	totalCount: number;
	offset: number;
	hasMore?: boolean;
	loading?: boolean;
};

const Pagination: FC<Props> = ({
	changeLimit,
	page,
	changePage,
	pageLimit,
	totalCount,
	hasMore,
	offset,
	loading,
}) => {
	useEffect(() => {
		const limit = parseInt(Store.get<string>('vsd-pagination-limit') ?? '');
		if (
			limit &&
			pageLimit !== limit &&
			pageLimitOptions.some(l => l === limit)
		) {
			changeLimit(limit);
		}
	}, [changeLimit, pageLimit]);
	return (
		<Flex
			width="100%"
			justifyContent="space-between"
			alignItems={['flex-end', 'center']}
			style={{ opacity: 0.5 }}
			flexDirection={['column', 'row']}
		>
			<Flex fontFamily="Roboto">
				<label htmlFor="pagination-select">
					<Text mr={1} style={selectStyle}>
						Počet záznamov na stránku:
					</Text>
				</label>
				<select
					id="pagination-select"
					style={{ ...selectStyle, border: 'none' }}
					value={pageLimit}
					onChange={e => {
						const limit = parseInt(e.target.value);
						changeLimit(limit);
						Store.set<number>('vsd-pagination-limit', limit);
						changePage(0);
					}}
				>
					{pageLimitOptions.map(o => (
						<option key={o} value={o} style={selectStyle}>
							{nameFromOption(o)}
						</option>
					))}
				</select>
			</Flex>
			{pageLimit > 0 && totalCount > pageLimit ? (
				<Flex alignItems="center" justifyContent="center">
					<Text style={selectStyle}>
						{`${offset + 1} - ${
							hasMore ? offset + pageLimit : totalCount
						} zo ${totalCount} záznamov`}
					</Text>

					<Button
						disabled={page < 1 || loading}
						variant="text"
						onClick={() => changePage(page - 1)}
						style={{ cursor: `${page < 1 ? 'not-allowed' : 'pointer'}` }}
					>
						<ArrowLeftIcon size={16} />
					</Button>
					{page + 1}
					<Button
						disabled={!hasMore || loading}
						style={{ cursor: `${!hasMore ? 'not-allowed' : 'pointer'}` }}
						variant="text"
						onClick={() => changePage(page + 1)}
					>
						<ArrowRightIcon size={16} />
					</Button>
				</Flex>
			) : (
				<>
					{totalCount ? (
						<Flex alignItems="center" justifyContent="center">
							Celkový počet záznamov: {totalCount}
						</Flex>
					) : (
						<></>
					)}
				</>
			)}
		</Flex>
	);
};

export default Pagination;
