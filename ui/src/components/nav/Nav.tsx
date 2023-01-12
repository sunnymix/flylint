import "./NavStyle.css";
import { ReactNode, useEffect, useState } from "react";
import { history, useLocation } from "umi";
import { HomeOutlined } from "@ant-design/icons";

interface NavItemProps {
  label: ReactNode,
  path?: string,
  key?: string,
};

const items: NavItemProps[] = [
  {
    label: <>
      <div className="main-icon">
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="56481" width="200" height="200"><path d="M426.666667 554.666667H170.666667c-23.466667 0-42.666667-19.2-42.666667-42.666667V170.666667c0-23.466667 19.2-42.666667 42.666667-42.666667h256c23.466667 0 42.666667 19.2 42.666666 42.666667v341.333333c0 23.466667-19.2 42.666667-42.666666 42.666667zM853.333333 896H597.333333c-23.466667 0-42.666667-19.2-42.666666-42.666667V512c0-23.466667 19.2-42.666667 42.666666-42.666667h256c23.466667 0 42.666667 19.2 42.666667 42.666667v341.333333c0 23.466667-19.2 42.666667-42.666667 42.666667z" fill="#185ABD" p-id="56482"></path><path d="M853.333333 384H597.333333c-23.466667 0-42.666667-19.2-42.666666-42.666667V170.666667c0-23.466667 19.2-42.666667 42.666666-42.666667h256c23.466667 0 42.666667 19.2 42.666667 42.666667v170.666666c0 23.466667-19.2 42.666667-42.666667 42.666667zM426.666667 896H170.666667c-23.466667 0-42.666667-19.2-42.666667-42.666667v-170.666666c0-23.466667 19.2-42.666667 42.666667-42.666667h256c23.466667 0 42.666667 19.2 42.666666 42.666667v170.666666c0 23.466667-19.2 42.666667-42.666666 42.666667z" fill="#41A5EE" p-id="56483"></path></svg>
      </div>
      </>,
    path: "/",
    key: "",
  },
  {
    label: <>wiki</>,
    path: "/wiki",
    key: "wiki",
  },
];

export default (props: any) => {

  // --- active item

  const [activeKey, setActiveKey] = useState<string>("");

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    var key = "";
    if (pathname.startsWith("/wiki")) {
      key = "wiki";
    }
    if (pathname.startsWith("/tag")) {
      key = "tag";
    }
    setActiveKey(key);
  }, [pathname]);

  const handleTabClick = (path: any) => {
    if (path) {
      history.push(path);
    }
  };

  // --- ui

  return (
    <div className='nav'>
      {items.map((item: NavItemProps, index: number) => (
        <div className={`nav_item ${(item.key == activeKey) && 'active'}`} key={index} onClick={() => handleTabClick(item.path)}>
          {item.label}
        </div>
      ))}
    </div>
  )
};
