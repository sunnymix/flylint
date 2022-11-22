import { Breadcrumb } from "antd";
import { useCallback, useEffect, useState } from "react";

// TODO:
// - expand parent after create

export interface WikiBreadcrumbProps {
  path: string,
  name: string,
};

const WikiBreadcrumb = (props: WikiBreadcrumbProps) => {

  const [items, setItems] = useState<string[]>([])

  const makeItems = useCallback((path: string, name: string) => {
    if (!path) {
      return [name];
    }

    let items = path.split("/").filter(v => v && v.length);
    items.push(name);
    return items;
  }, []);

  useEffect(() => {
    setItems(makeItems(props.path, props.name));
  }, [props.path, props.name])

  return (
    <Breadcrumb>
      {items.map((item, index) => 
        <Breadcrumb.Item>{item}</Breadcrumb.Item>)}
    </Breadcrumb>
  );
};

export default WikiBreadcrumb;
