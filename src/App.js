import React from 'react';
import styled from 'styled-components';
// import logo from './logo.svg';
import { AppContainer } from './styles'; // , AppHeader, AppTitle, AppLogo, AppIntro
import Tracker from './Tracker';
import { GlobalStyle } from 'styles/global.js';
import Grid from 'components/Grid';
import Background from 'components/Background';

export const Button = styled.button``;

function App () {
	return (
		<React.Fragment>
			<GlobalStyle />
			<AppContainer>
				<Tracker />
				<Background />
				<Grid />
			</AppContainer>
		</React.Fragment>
	);
}

export default App;
