import { useState } from 'react';
const UnsupportedBrowserWarning = () => {
	const [showWarning, setShowWarning] = useState({ display: 'block' });
	return (
		<div style={{ height: 50, ...showWarning }}>
			<div
				style={{
					position: 'fixed',
					width: '100%',
					backgroundColor: 'yellow',
					zIndex: 999,
					paddingTop: 3,
					paddingBottom: 3,
					paddingLeft: 12,
					paddingRight: 12,
					borderBottom: '1px solid black',
				}}
			>
				<span style={{ paddingRight: 15 }}>
					<span style={{ color: 'red', fontWeight: 800, fontSize: 24 }}>
						{' '}
						!{' '}
					</span>
					<strong>Upozornění: </strong>Verze Vašeho prohlížeče není podporována
					a je možné, že některé části stránky nebudou fungovat správně. Prosím,
					aktualizujte svůj prohlížeč, nebo použijte jiný (Chrome, Firefox,
					Safari, Opera).
				</span>
				<span>
					<button
						style={{
							padding: '2px 15px 0px 15px',
							cursor: 'pointer',
						}}
						onClick={() => setShowWarning({ display: 'none' })}
					>
						OK
					</button>
				</span>
			</div>
		</div>
	);
};

export default UnsupportedBrowserWarning;
