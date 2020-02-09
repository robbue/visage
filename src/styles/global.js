import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import { fontFaces, fontSizes, fontWeights, media } from './index';

export const GlobalStyle = createGlobalStyle`
	*,
	*:before,
	*:after {
	 box-sizing: inherit;
	 outline: none;
	 // -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	 -webkit-font-smoothing: antialiased;
	}

	${normalize()}

	html {
		box-sizing: border-box;

		font-size: ${fontSizes.small};

		${media.small`font-size: ${fontSizes.small};`}
		${media.medium`font-size: ${fontSizes.medium};`}
		${media.large`font-size: ${fontSizes.large};`}
		${media.xlarge`font-size: ${fontSizes.xlarge};`}
	}

	body {
		font-family: ${fontFaces.body};
		font-weight: ${fontWeights.normal};
		font-style: normal;
		line-height: 1;
		overflow-x: hidden;
	}

	div {
	  white-space: pre-wrap;
	}

	article,
	aside,
	details,
	figcaption,
	figure,
	footer,
	header,
	hgroup,
	main,
	menu,
	nav,
	section,
	summary {
		display: block;
	}

	a {
		text-decoration: none;
	}

	figure {
		margin: 0;
	}

	strong {
		font-weight: ${fontWeights.bold};
	}

	button {
		font-family: inherit;
		font-weight: inherit;
		line-height: 1;

		margin: 0;
		padding: 0;

		border: 0;
		background: transparent;
	}

	fieldset {
		border: 0;
		margin: 0;
		padding: 0;
	}
`;
