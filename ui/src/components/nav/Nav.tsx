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
      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="301914" width="200" height="200"><path d="M213.333333 170.666667a128 128 0 0 0-128 128v426.666666a128 128 0 0 0 128 128h129.109334a256 256 0 0 1 80.981333 13.141334L512 896l88.576-29.525333A256.042667 256.042667 0 0 1 681.557333 853.333333H810.666667a128 128 0 0 0 128-128V298.666667a128 128 0 0 0-128-128h-170.666667a170.24 170.24 0 0 0-128 57.770666A170.24 170.24 0 0 0 384 170.666667H213.333333z" fill="#9F9F9F" p-id="301915"></path><path d="M85.333333 298.666667a128 128 0 0 1 128-128h170.666667a170.24 170.24 0 0 1 128 57.770666V896l-88.576-29.525333A256 256 0 0 0 342.442667 853.333333H213.333333a128 128 0 0 1-128-128V298.666667z" fill="#000000" p-id="301916"></path></svg>
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
