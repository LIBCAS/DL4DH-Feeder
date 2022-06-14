import {
	TableContextProvider,
	useTable,
	createTableContext,
} from 'components/table/useTable';

const Table = () => {
	//const table = useTable();
	//console.log({ table });

	return <>table table</>;
};

const TestTable = () => {
	const { Provider } = createTableContext<{ width: number }>();

	return (
		<>
			<Provider value={{ height: 10, data: [{ width: 365 }] }}>
				<Table />
			</Provider>
		</>
	);
};

export default TestTable;
