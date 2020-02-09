import styled, { css } from 'styled-components';
import { rem, em } from 'polished';
import { colors, fontSizes, fontFaces } from 'styles/index';

export const pStyles = (args) => css`
	font-size: ${props => props.fontSize ? rem(`${props.fontSize}px`) : rem(fontSizes.medium)};
	color: ${props => props.color ? props.color : colors.text};
	line-height: 1.4;
	font-family: ${fontFaces.body};
	text-align: ${props => props.textAlign ? props.textAlign : 'inherit'};

	margin: 0 0 ${em('15px')} 0;
`;

const P = styled.p`
	${pStyles}
`;

export default P;
