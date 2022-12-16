import React, { Children } from "react";
import styled, { css } from "styled-components";
import { rem } from "polished";
import {
  media,
  colors,
  headerSizes,
  headerSizesMobile,
  fontFaces,
  fontWeights,
} from "styles/index";

export const HeaderStyles = (args) => css`
  position: relative;

  font-family: ${fontFaces.header};
  font-weight: ${fontWeights.bold};
  font-style: normal;
  font-size: ${(props) => rem(headerSizesMobile[props.rank])};
  line-height: 0.95;

  display: inline-block;
  margin: 0 0 ${(props) => (props.mb ? rem(`${props.mb}px`) : rem("20px"))} 0;
  padding: 0;

  ${media.large`
		font-size: ${(props) => rem(headerSizes[props.rank])};
	`}

  a {
    text-decoration: none;
    color: ${colors.header};
  }
`;

const Header = styled.h2`
  ${HeaderStyles}
  color: ${(props) => (props.color ? props.color : colors.header)};
  text-align: ${(props) => (props.textAlign ? props.textAlign : "inherit")};
  a {
    text-decoration: none;
    color: currentColor;
  }
`;

export default ({
  color,
  rank = 2,
  asRank,
  children,
  className,
  underLine,
  textAlign,
  asTag,
  onClick,
}) => {
  let tag = rank > 6 ? "h6" : `h${rank}`;
  let rankSize = tag;

  if (asTag) tag = asTag;
  if (asRank) rankSize = `h${asRank}`;

  return (
    <Header
      textAlign={textAlign}
      color={color}
      rank={rankSize}
      as={tag}
      className={className}
      underLine={underLine}
    >
      {Children.toArray(children)}
    </Header>
  );
};
