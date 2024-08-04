//  credits to https://github.com/ma3a/SDH-PlayTime

import { VerticalContainerCSS } from "../styles";

type Props = {
  style?: React.CSSProperties;
  children?: React.ReactNode;
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
