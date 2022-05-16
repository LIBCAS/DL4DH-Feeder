/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import { remove } from 'lodash-es';

import TextInput from 'components/form/input/TextInput';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text from 'components/styled/Text';
import DatePicker from 'components/form/datepicker';
import SelectInput from 'components/form/select/SelectInput';
import ActiveFilters from 'components/form/filters/ActiveFilters';

import { ArrowUpIcon, ArrowDownIcon, ResetIcon } from 'assets';
import { theme } from 'theme';
import { getDateString } from 'utils';

import { Backend } from 'api/endpoints';

import Store from 'utils/Store';
import { readingStateText, readingStateTuple } from 'utils/enumsMap';

import useAdminFilter, { FILTER_INIT_VALUES } from './useAdminFilter';

type ReadingState = Backend.ReadingState;

const FiltersForm: FC<
	Omit<ReturnType<typeof useAdminFilter>, 'params'> & {
		isLoading?: boolean;
	}
> = ({ filters, sort, isLoading }) => {
	const [showFilter, setShowFilter] = useState(
		Store.get<boolean>('vsd-intern-filter-open', false),
	);

	//Form state
	const formikContext = useFormik({
		initialValues: filters.filter,
		onSubmit: async v => {
			filters.setFilter(v);
		},
	});

	const {
		handleSubmit,
		values,
		setFieldValue,
		handleChange,
		isSubmitting,
		setValues,
	} = formikContext;
	const resetFilter = () => {
		filters.setFilter(FILTER_INIT_VALUES);
		setValues(FILTER_INIT_VALUES);
		sort.deselect();
	};

	/* const { onResetFilter } = useDebouncedSubmit(
		handleSubmit,
		INITIAL_VALUES,
		values,
		setValues,
	); */

	const loading = isSubmitting || isLoading;

	return (
		<>
			<form onSubmit={handleSubmit}>
				<Flex
					width="100%"
					my={3}
					justifyContent="space-between"
					alignItems="center"
					flexDirection={['row', 'row']}
				>
					<Button
						onClick={() => {
							Store.set<boolean>('vsd-intern-filter-open', !showFilter);
							setShowFilter(p => !p);
						}}
						variant="primary"
					>
						{showFilter ? <ArrowUpIcon mr={2} /> : <ArrowDownIcon mr={2} />}
						Filtrovať
					</Button>
				</Flex>
				<Flex alignItems="center" width="100%">
					<ActiveFilters
						onReset={resetFilter}
						refresh={handleSubmit}
						items={[
							...(values.email
								? [
										{
											key: 'email',
											name: 'Email',
											value: values.email,
											onClick: () => {
												setFieldValue('email', null);
											},
										},
								  ]
								: []),
							...(values.deliveryPoint
								? [
										{
											key: 'deliveryPoint',
											name: 'Odberné miesto',
											value: values.deliveryPoint,
											onClick: () => {
												setFieldValue('deliveryPoint', null);
											},
										},
								  ]
								: []),
							...(values.barcode
								? [
										{
											key: 'barcode',
											name: 'Výrobné číslo',
											value: values.barcode,
											onClick: () => {
												setFieldValue('barcode', null);
											},
										},
								  ]
								: []),
							...(values.record1
								? [
										{
											key: 'record1',
											name: 'Stav 1',
											value: values.record1,
											onClick: () => setFieldValue('record1', null),
										},
								  ]
								: []),
							...(values.record2
								? [
										{
											key: 'record2',
											name: 'Stav 2',
											value: values.record2,
											onClick: () => setFieldValue('record2', null),
										},
								  ]
								: []),
							...(values.readingDate
								? [
										{
											key: 'readingDate',
											name: 'Dátum odpočtu',
											value: getDateString(values.readingDate),
											onClick: () => setFieldValue('readingDate', null),
										},
								  ]
								: []),
							...(values.definiteEvaluation
								? [
										{
											key: 'definiteEvaluation',
											name: 'Dátum overenia',
											value: getDateString(values.definiteEvaluation),
											onClick: () => setFieldValue('definiteEvaluation', null),
										},
								  ]
								: []),
							...values.state.map(s => ({
								key: s,
								name: readingStateText[s],
								onClick: () =>
									setFieldValue(
										'state',
										remove(values.state, v => v !== s),
									),
							})),
						]}
					/>
				</Flex>
				<Box
					display={showFilter ? 'block' : 'none'}
					css={css`
						border-top: 1px solid ${theme.colors.border};
						/* overflow: scroll; */
					`}
				>
					<Flex
						width="100%"
						my={3}
						height={showFilter ? [850, 460, 400, 300] : 'unset'}
						flexDirection="column"
					>
						<Flex
							fontSize="12px"
							width={1}
							flexDirection={['column', 'row']}
							flexWrap="wrap"
						>
							<Box mr={[0, 3]} mt={3} minWidth={210}>
								<TextInput
									id="email"
									name="email"
									label="Email odberateľa"
									labelType="aboveInput"
									placeholder="Zvolte email odberateľa"
									value={values.email}
									onChange={handleChange}
									disabled={loading}
								/>
							</Box>
							<Box mr={[0, 3]} mt={3} minWidth={210}>
								<TextInput
									id="deliveryPoint"
									name="deliveryPoint"
									label="Odberné miesto"
									labelType="aboveInput"
									placeholder="Zvolte odberné miesto"
									value={values.deliveryPoint}
									onChange={handleChange}
									disabled={loading}
									type="number"
								/>
							</Box>
							<Box mr={[0, 3]} mt={3} minWidth={210}>
								<TextInput
									id="barcode"
									name="barcode"
									label="Výrobné číslo"
									labelType="aboveInput"
									placeholder="Zvolte výrobné číslo"
									value={values.barcode}
									onChange={handleChange}
									disabled={loading}
								/>
							</Box>
							<Box mr={[0, 3]} mt={3} minWidth={210}></Box>
							<Box mr={[0, 3]} mt={3} minWidth={210}></Box>

							<Box mr={[0, 3]} mt={[3, 3]} minWidth={210}>
								<DatePicker
									id="readingDate"
									name="readingDate"
									isLoading={loading}
									value={
										values.readingDate instanceof Date
											? values.readingDate?.toDateString()
											: ''
									}
									label="Dátum odpočtu"
									onSetValue={setFieldValue}
									placeholder="Zvolte dátum"
									disabled={loading}
								/>
							</Box>
							<Box mr={[0, 3]} mt={3} minWidth={210}>
								<DatePicker
									isLoading={loading}
									id="definiteEvaluation"
									name="definiteEvaluation"
									value={
										values.definiteEvaluation instanceof Date
											? values.definiteEvaluation?.toDateString()
											: ''
									}
									label="Dátum overenia"
									onSetValue={setFieldValue}
									placeholder="Zvolte dátum"
									disabled={loading}
								/>
							</Box>
							<Box mr={[0, 3]} mt={3} minWidth={210}>
								<SelectInput
									key="state"
									id="state"
									label="Stav"
									labelType="aboveInput"
									placeholder="Zvolte stav"
									value={values.state}
									options={readingStateTuple}
									onSetValue={setFieldValue}
									nameFromOption={(o: ReadingState | null) =>
										o ? readingStateText[o] : ''
									}
									multiselect
									hideInlineSelectItems
									loading={loading}
									disabled={loading}
								/>
							</Box>
						</Flex>

						<Flex
							fontSize="12px"
							width={1}
							mt={4}
							pt={4}
							css={css`
								border-top: 1px solid ${theme.colors.border};
							`}
						>
							<Button
								px={0}
								type="submit"
								variant="primary"
								loading={loading}
								disabled={loading}
							>
								{!loading && <MdCheck />}
								<Text ml={1} as="span" fontWeight="normal">
									Použiť
								</Text>
							</Button>
							<Button px={0} onClick={resetFilter} variant="text" ml={3}>
								<ResetIcon size={16} />
								<Text ml={1} as="span">
									Resetovať
								</Text>
							</Button>
						</Flex>
					</Flex>
				</Box>
			</form>
		</>
	);
};

export default FiltersForm;
