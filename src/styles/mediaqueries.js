import { css } from 'styled-components';
import { mediaSizes } from './variables';

// iterate through the sizes and create a media template
export const media = Object.keys(mediaSizes).reduce((accumulator, label) => {
	// use em in breakpoints to work properly cross-browser and support users
	// changing their browsers font-size: https://zellwk.com/blog/media-query-units/
	const emSize = Math.round(mediaSizes[label] / 16);

	accumulator[label] = (...args) => css`
	  @media (min-width: ${emSize}em) {
	    ${css(...args)}
	  }
	`;

	return accumulator;
}, {});

export const mediaHeight = Object.keys(mediaSizes).reduce((accumulator, label) => {
	// use em in breakpoints to work properly cross-browser and support users
	// changing their browsers font-size: https://zellwk.com/blog/media-query-units/
	const emSize = Math.round(mediaSizes[label] / 16);

	accumulator[label] = (...args) => css`
	  @media (max-height: ${emSize}em) and (min-width: 1024px) {
	    ${css(...args)}
	  }
	`;

	return accumulator;
}, {});

export const mediaJS = Object.keys(mediaSizes).reduce((accumulator, label) => {
	const emSize = Math.round(mediaSizes[label] / 16);

	if (typeof window !== 'undefined') {
		accumulator[label] = window.matchMedia(`(min-width: ${emSize}em`).matches;
	}
	return accumulator;
}, {});
