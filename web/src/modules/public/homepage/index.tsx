/** @jsxImportSource @emotion/react */
import { FC, useState } from 'react';
import { css } from '@emotion/core';
import { MdSearch, MdClear, MdArrowForward, MdInfo } from 'react-icons/md';

import { ResponsiveWrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';
import TextInput from 'components/form/input/TextInput';
import Text from 'components/styled/Text';

import placeholder from 'assets/title_placeholder.png';

const Homepage: FC = () => {
	const [toSearch, setToSearch] = useState('');
	return (
		<ResponsiveWrapper bg="white" px={1} mx={0}>
			<Flex alignItems="center" justifyContent="center" height="100vh">
				<Flex
					flexDirection="column"
					width={[1, 1 / 2]}
					alignItems="center"
					justifyContent="center"
				>
					<img src={placeholder} height={50} />
					<Flex mt={3} mb={4} flexDirection="column" alignItems="center">
						<Text fontSize="xl" fontWeight="bold">
							Studijní a vědecká knihovna Plzeňského kraje
						</Text>
						<Flex my={2} width={1} maxWidth={200} height={1} bg="border"></Flex>

						<Text fontSize="md">DL4DH Feeder</Text>
					</Flex>
					<Flex px={3} width={1} flexShrink={1}>
						<TextInput
							placeholder="Hledejte v DL4DH Feeder"
							label=""
							labelType="inline"
							color="primary"
							value={toSearch}
							iconLeft={
								<Flex color="primary" ml={2}>
									<MdSearch size={26} />
								</Flex>
							}
							iconRight={
								toSearch !== '' ? (
									<Flex mr={3} color="primary">
										<MdClear
											onClick={() => setToSearch('')}
											css={css`
												cursor: pointer;
											`}
										/>
									</Flex>
								) : (
									<></>
								)
							}
							onChange={e => {
								setToSearch(e.currentTarget.value);
							}}
						/>
						{/* <Flex alignItems="center" minWidth={150}>
							<Checkbox aria-label="Pouze veřejné" />
							<Text fontSize="sm">Pouze veřejné</Text>
						</Flex> */}
					</Flex>
					<NavLinkButton mt={4} to={`/search?q=${toSearch}`} variant="primary">
						Vstoupit do DL4DH Feeder{' '}
						<Flex ml={2}>
							<MdArrowForward size={22} />
						</Flex>
					</NavLinkButton>
				</Flex>
			</Flex>
			<Flex position="sticky" bottom={10} width={1} justifyContent="center">
				<Flex
					py={[3, 4]}
					// px={4}
					bg="primaryLight"
					flexDirection="column"
					width={[1, 1 / 2]}
					justifyContent="center"
					alignItems="center"
				>
					<Flex alignItems="center">
						<MdInfo />
						<Text ml={2} fontSize="md" fontWeight="bold">
							Co je DL4DH Feeder?
						</Text>
					</Flex>
					<Text textAlign="center" fontSize="sm" px={[3, 5]}>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
						ad animi quod illum enim? Ex, accusamus ad ipsa explicabo incidunt
						voluptatem dolorum architecto unde officiis at quia! Explicabo
						reprehenderit incidunt culpa sint soluta tempore sunt porro natus
						accusamus. Repellendus ut ullam quasi ratione cum ipsum eius sequi,
						omnis inventore eos.
					</Text>
				</Flex>
			</Flex>
		</ResponsiveWrapper>
	);
};

export default Homepage;
