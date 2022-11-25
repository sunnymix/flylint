import React from "react";
import ReactDOM from "react-dom";

export interface PortalProps {
  children: React.ReactNode,
};

const Portal = (props: PortalProps) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(props.children, document.body)
    : null;
};

export default Portal;
