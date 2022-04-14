/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useCallback, Fragment } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdCheck, MdClose, MdDelete } from 'react-icons/md';

import ErrorFeedback from 'components/error/ErrorFeedback';
import { Box, Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Text from 'components/styled/Text';
import Paper from 'components/styled/Paper';

import { theme } from 'theme';

import { BROWSER_MAX_PHOTO_FILE_SIZE } from 'utils/enumsMap';

import { getAcceptedFileTypes } from './_utils';
import ContentNode from './ContentNode';
import { CsvFileInputProps } from './_typing';

const CsvFileInput: React.FC<CsvFileInputProps> = ({
	id,
	disabled,
	accept,
	error,
	touched,
	onSetValue,
	value,
}) => {
	const handleFileSet = useCallback(
		async (files: File[]) => {
			if (!files?.[0]) {
				return;
			}
			const file = files[0];

			onSetValue(id, file ?? null);
		},
		[id, onSetValue],
	);

	// Dropzone
	const {
		open,
		getRootProps,
		getInputProps,
		isDragActive,
		isDragReject,
		fileRejections,
	} = useDropzone({
		onDrop: handleFileSet,
		disabled,
		multiple: false,
		accept: '.csv, application/vnd.ms-excel, text/csv',
		maxSize: BROWSER_MAX_PHOTO_FILE_SIZE,
		noClick: true,
	});

	return (
		<Paper
			px={0}
			mb={3}
			mx={0}
			mt={0}
			py={0}
			position="relative"
			overflow="hidden"
			width={1}
			maxHeight={300}
		>
			{value ? (
				<Flex
					flexDirection="column"
					bg="lightGrey"
					px={3}
					css={css`
						border: 1px solid ${theme.colors.border};
					`}
				>
					<Flex>
						<Text mr={2}>Nahraný súbor:</Text>
						<Text fontWeight="bold">{value.name}</Text>
					</Flex>
					<Flex width={1} justifyContent="flex-end" alignItems="center">
						<Button
							m={0}
							p={0}
							variant="text"
							color="error"
							onClick={() => onSetValue(id, null)}
						>
							<Flex alignItems="center">
								<MdDelete size={20} />
								<Text fontWeight="bold" color="text">
									Nahrať iný súbor
								</Text>
							</Flex>
						</Button>
					</Flex>
				</Flex>
			) : (
				<div
					{...getRootProps()}
					css={css`
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						margin-top: 0;
						padding: ${theme.space[1]}px ${theme.space[3]}px;
						border: 2px dashed
							${
								// eslint-disable-next-line no-nested-ternary
								(error && touched) || (isDragActive && isDragReject)
									? theme.colors.error
									: isDragActive && !isDragReject
									? theme.colors.success
									: theme.colors.primary
							};
						flex: 1;
						z-index: 1;
					`}
				>
					<input {...getInputProps({ id })} />
					{isDragActive ? (
						<React.Fragment>
							{isDragReject ? (
								<ContentNode
									icon={<MdClose color="error" />}
									variant="error"
									title="Nie je súbor .csv"
									subtitle="Povolený typ: *.csv"
								/>
							) : (
								<ContentNode
									icon={<MdCheck color="primary" />}
									title="Nahrať csv súbor"
									variant="success"
									subtitle={'Pustite po pretiahnutí do tohto okna'}
								/>
							)}
						</React.Fragment>
					) : (
						<React.Fragment>
							<ContentNode
								title="Pretiahnite súbor typu CSV sem,"
								subtitle="alebo vyberte priamo z disku"
								variant="info"
								button={
									<Button variant="primary" my={3} onClick={open}>
										Vybrať súbor
										{accept ? ` (${getAcceptedFileTypes(accept)})` : ''}
									</Button>
								}
							/>

							{fileRejections.length > 0 && (
								<Fragment>
									<Text mb={0} color="error">
										Nepodarilo sa načítať
									</Text>
									{fileRejections.map(f => (
										<Text my={0} key={f.file.name} fontSize="sm" color="error">
											{f.file.name} (
											{f.errors
												.map(e =>
													e.code === 'file-invalid-type'
														? 'Požadovaný typ súboru: csv'
														: e.message,
												)
												.join(', ')}
											)
										</Text>
									))}
								</Fragment>
							)}
						</React.Fragment>
					)}
				</div>
			)}

			{error && touched && (
				<Box position="absolute" bottom={0} right={0} mx={3} my={2}>
					<ErrorFeedback>{error}</ErrorFeedback>
				</Box>
			)}
		</Paper>
	);
};
export default CsvFileInput;
