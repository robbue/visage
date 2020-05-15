import styled from 'styled-components';
import { rem, em, lighten } from 'polished';
import { colors, fontWeights, fontFaces, fontSizes } from 'styles/index';

import { ReactComponent as Webcam } from 'assets/svg/webcam.svg';
import { ReactComponent as Pin } from 'assets/svg/pin.svg';

export const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

export const Preloader = styled.div`
	position: absolute;
	z-index: 100;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	background: ${colors.light};
	visibility: hidden;
`;

export const Content = styled.div`
	position: absolute;
	z-index: 2;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const Section = styled.div`
	text-align: center;
	display: none;
`;

export const GeoLocationAccess = styled(Section)``;
export const Location = styled(Section)``;
export const CameraAccess = styled(Section)``;
export const Completed = styled(Section)``;

export const Skip = styled.button`
	position: fixed;
	z-index: 99;
	bottom: 0;
	right: 0;
	width: 50px;
	height: 50px;

	&:hover {
		background: red;
	}
`;

export const Skip2 = styled.button`
	position: fixed;
	z-index: 99;
	bottom: 50px;
	right: 0;
	width: 50px;
	height: 50px;

	&:hover {
		background: blue;
	}
`;

export const WebcamIcon = styled(Webcam)`
	width: ${em('22px')};
	height: ${em('22px')};
	margin-right: ${em('15px')};

	path, circle {
		fill: ${colors.grey};
		transition: fill 250ms ease;
	}
`;

export const PinIcon = styled(Pin)`
	width: ${em('22px')};
	height: ${em('22px')};
	margin-right: ${em('15px')};

	path {
		fill: ${colors.grey};
		stroke: none;
		stroke-width: 1;
		stroke-dasharray: none;
		stroke-linecap: butt;
		stroke-linejoin: miter;
		stroke-miterlimit: 10;
		fill-rule: nonzero;
		transition: fill 250ms ease;
	}
`;

export const Button = styled.button`
	display: inline-flex;
	align-items: center;
	position: relative;
	font-size: ${rem('12px')};
	font-weight: ${fontWeights.medium};
	text-transform: uppercase;

	padding: ${em('16px')} ${em('18px')};
	margin-top: ${em('15px')};
	cursor: pointer;
	overflow: hidden;

	border: 1px solid ${colors.light};
	transition: border 250ms ease, color 250ms ease;

	&::after {
		content: '';
		position: absolute;
		z-index: -1;
		top: 100%;
		left: 0;
		width: 100%;
		height: 100%;
		background: ${colors.dark};
		transition: transform 250ms ease;
	}

	&:hover {
		// border-color: ${lighten(0.1, colors.light)};
		border-color: ${colors.dark};
		color: ${colors.white};

		&::after {
			transform: translateY(-100%);
		}

		${WebcamIcon} {

		}

		${PinIcon} {
			path {
				fill: ${colors.white};
			}
		}
	}
`;

export const Text = styled.p`
	font-family: ${fontFaces.header};
	font-size: ${rem(fontSizes.large)};
	color: ${colors.text};
	line-height: 1.8;

	padding: 0 ${rem('25px')};
	margin: 0;
	display: none;
`;



export const Canvas = styled.canvas``;
export const Status = styled.p``;
