//  credits to https://github.com/ma3a/SDH-PlayTime

import { HorizontalContainerCSS } from "../styles";

type Props = {
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const HorizontalContainer: React.FC<Props> = (props) => {
  return (
    <div
      style={{
        ...HorizontalContainerCSS.horizontal__container,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
};
