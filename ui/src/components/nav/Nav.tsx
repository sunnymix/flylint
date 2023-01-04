
import "./NavStyle.css";
import { ReactNode, useEffect, useState } from "react";
import { history, useLocation, Link } from "umi";
import { ProjectOutlined } from "@ant-design/icons";

interface NavItemProps {
  label: ReactNode,
  path?: string,
  key?: string,
};

const items: NavItemProps[] = [
  {
    label: <><ProjectOutlined /></>,
    path: "/",
    key: "",
  },
  {
    label: <>wiki</>,
    path: "/wiki",
    key: "wiki",
  },
  {
    label: <>catalog</>,
    path: "/catalog",
    key: "catalog",
  },
  {
    label: <>meta</>,
    path: "/meta",
    key: "meta",
  },
  {
    label: <>topic</>,
    path: "/topic",
    key: "topic",
  },
  {
    label: <>media</>,
    path: "/media",
    key: "media",
  },
  {
    label: <>draw</>,
    path: "/draw",
    key: "draw",
  },
  {
    label: <>tool</>,
    path: "/tool",
    key: "tool",
  },
  {
    label: <>tag</>,
    path: "/tag",
    key: "tag",
  },
  {
    label: <>okr</>,
    path: "/okr",
    key: "okr",
  },
  {
    label: <>about</>,
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
    if (pathname.startsWith("/catalog")) {
      key = "catalog";
    }
    if (pathname.startsWith("/topic")) {
      key = "topic";
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
    if (pathname.startsWith("/tag")) {
      key = "tag";
    }
    if (pathname.startsWith("/meta")) {
      key = "meta";
    }
    if (pathname.startsWith("/okr")) {
      key = "okr";
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
    </div>
  )
};
