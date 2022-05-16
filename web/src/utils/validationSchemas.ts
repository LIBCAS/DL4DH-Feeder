import * as Yup from 'yup';
export const integerRequiredSchema = Yup.number()
	.min(0, 'Musí byť kladné celé číslo')
	.integer('Musí byť celé číslo')
	.typeError('Musí byť celé číslo')
	.required('Požadované');
