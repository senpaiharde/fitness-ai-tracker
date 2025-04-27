import React, { JSX, PropsWithChildren } from "react";


import './shiny.css';

type Props = PropsWithChildren<{
    speed?: number,
    disabled? : boolean,
    className?: string,
    as?: keyof JSX.IntrinsicElements;
}>;



const Shiny = ({
    children,
    speed = 5,
    disabled = false,
    className = "",
    as: Tag = "span",
  }: Props) => {
    return (
      <Tag
        className={`shiny ${disabled ? "is-disabled" : ""} ${className}`}
        style={{ "--_shine-duration": `${speed}s` } as React.CSSProperties}
      >
        {children}
      </Tag>
    );
  };
  
  export default Shiny;