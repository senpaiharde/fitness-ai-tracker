// src/ui/ShinyButton.tsx
import { ButtonHTMLAttributes, FC } from "react";
import "./shiny.css";       // imports keyframes
import "./ShinyButton.css"; // imports the .btn-shiny rules

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  speed?: number;          // seconds for one sweep
};

const ShinyButton: FC<Props> = ({ speed = 5, children, ...rest }) => (
  <button
    {...rest}
    className={`btn-shiny ${rest.className ?? ""}`}
    style={{ "--_shine-duration": `${speed}s` } as React.CSSProperties}
  >
    {children}
  </button>
);

export default ShinyButton;
