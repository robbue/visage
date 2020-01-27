import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
// import logo from './logo.svg';
import { AppContainer } from './styles'; // , AppHeader, AppTitle, AppLogo, AppIntro
import Tracker from './Tracker';

// Add global styles
const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		padding: 0;
		font-family: sans-serif;
	}
`;

export const Button = styled.button``;

function App () {
	return (
		<React.Fragment>
			<GlobalStyle />
			<AppContainer>
				<Tracker />
			</AppContainer>
		</React.Fragment>
	);
}

export default App;
