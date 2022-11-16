
import "./NavStyle.css";
import { ReactNode, useEffect, useState } from "react";
import { history, useLocation, Link } from "umi";
import { HomeFilled, SearchOutlined } from "@ant-design/icons";

interface NavItemProps {
  label: ReactNode,
  path?: string,
  key?: string,
};

const items: NavItemProps[] = [
  {
    label: <><HomeFilled /></>,
    path: "/",
    key: "",
  },
  {
    label: <>Wiki</>,
    path: "/wiki",
    key: "wiki",
  },
  {
    label: <>Media</>,
    path: "/media",
    key: "media",
  },
  {
    label: <>Draw</>,
    path: "/draw",
    key: "draw",
  },
  {
    label: <>Tool</>,
    path: "/tool",
    key: "tool",
  },
  {
    label: <>About</>,
    path: "/about",
    key: "about",
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
    if (pathname.startsWith("/media")) {
      key = "media";
    }
    if (pathname.startsWith("/draw")) {
      key = "draw";
    }
    if (pathname.startsWith("/tool")) {
      key = "tool";
    }
    if (pathname.startsWith("/about")) {
      key = "about";
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
      <div className="nav_item">
        <SearchOutlined />
      </div>
    </div>
  )
};
