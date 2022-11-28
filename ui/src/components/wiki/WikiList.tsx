import { forwardRef, useEffect, useState } from "react";
import WikiApi from "./WikiApi";
import { BasicWiki } from "./WikiModel";
import Time from "@/components/common/Time";
import { history } from "umi";
import { Button, Dropdown, MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import wiki from "@/pages/wiki";
import WikiCreateButton from "./WikiCreateButton";

/**
 * WkikList 组件属性
 */
export interface WikiListProps {
  refreshSignal?: string,
}

export default forwardRef((props: WikiListProps, ref) => {

  /**
   * 属性：wikis 数据
   */
  const [wikis, setWikis] = useState<BasicWiki[]>([]);

  /**
   * 响应：初始化
   */
  useEffect(() => {
    WikiApi.query(null, (wikis: BasicWiki[]) => {
      setWikis(wikis);
    });
  }, [props.refreshSignal]);

  /**
   * 动作：点击 wiki
   * @param wiki wiki 数据
   */
  const clickWiki = (wiki: BasicWiki) => {
    history.push(`/wiki/${wiki.name}`);
  };
  
  return (
    <div>
      <div className="com-header">
        <div className="com-title">WIKI</div>
        <div className="com-ops">
          <div className="com-op"><WikiCreateButton mode="wiki" /></div>
        </div>
      </div>
      <div className="com-body">
        <div>
          <h4>RECENT</h4>
          <div className="wiki_list">
            {wikis.map((wiki: BasicWiki, index: number) => (
              <div className="wiki_list_item" key={wiki.name} onClick={() => clickWiki(wiki)}>
                <div className="wiki_list_item_title">{wiki.title}</div>
                <div className="wiki_time">{Time.formatDate(wiki.created)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
