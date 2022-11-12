import { forwardRef, useState } from "react";

export interface WikiProps {
  path: string,
  refreshSignal?: string,
};

export default forwardRef((props: WikiProps, ref) => {

  const [title, setTitle] = useState<string>("");

  return (
    <div>
      <div className="component_title">Wiki {props.path}</div>
    </div>
  );
});
