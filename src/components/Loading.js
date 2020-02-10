import React from 'react';
import styled from 'styled-components';
import Spinner from 'react-loader-spinner';
import { rem, em } from 'polished';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import P from 'components/P';
import { colors } from 'styles/index';

const Wrapper = styled.div`
	font-size: ${rem('16px')};

	display: inline-flex;

	align-items: center;
	text-align: left;
`;

const Loader = styled(Spinner)`
	margin-right: ${em('20px')};
`;

const Text = styled(P)`
	width: 100%;
	font-size: ${rem('12px')};
	color: ${colors.medium};
	margin: 0;
	padding: 0;
`;

export default React.forwardRef((props, ref) => (
	<Wrapper ref={ref}>
		<Loader type={'Triangle'} color={colors.primary} height={60} width={60} />
		{props.children && <Text>{props.children}</Text>}
	</Wrapper>
));
