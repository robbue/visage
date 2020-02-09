import styled from 'styled-components';

export default styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	z-index: 200;
	background: repeating-linear-gradient(90deg,#979797,#979797 1px,transparent 0,transparent 16.66667vw);
	opacity: .06;
`;
