import "./NavStyle.css";
import { ReactNode, useEffect, useState } from "react";
import { history, useLocation } from "umi";

interface NavItemProps {
  label: ReactNode,
  path?: string,
  key?: string,
};

const items: NavItemProps[] = [
  {
    label: <>
      <div className="main-icon">
      <svg viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M259.072 881.536l128.896 135.808 566.208-132.16V125.76l-62.528-37.184-503.68 164.928-68.16-66.56 492.8-146.24-73.472-40-479.168 135.808-0.896 745.024z" fill="#1677ff"></path></svg>
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
  {
    label: <>tag</>,
    path: "/tag",
    key: "tag",
  },
  {
    label: <>media</>,
    path: "/media",
    key: "media",
  },
  {
    label: <>meta</>,
    path: "/meta",
    key: "meta",
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
    if (pathname.startsWith("/meta")) {
      key = "meta";
    }
    if (pathname.startsWith("/media")) {
      key = "media";
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
