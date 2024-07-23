//  credits to https://github.com/ma3a/SDH-PlayTime

import { CSSProperties } from "react";
import { VerticalContainerCSS } from "../styles";

type Props = {
  style?: CSSProperties;
};

export const VerticalContainer: React.FC<Props> = (props) => {
  return (
    <div
      style={{ ...VerticalContainerCSS.vertical__container, ...props.style }}
    >
      {props.children}
    </div>
  );
};
