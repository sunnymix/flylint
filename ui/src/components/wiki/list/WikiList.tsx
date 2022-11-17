import { forwardRef, useEffect, useState } from "react";
import WikiApi from "../api/WikiApi";
import { BasicWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiListStyle.css";
import { history } from "umi";
import { Button, Dropdown, MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import wiki from "@/pages/wiki";
import WikiCreateButton from "../button/WikiCreateButton";

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
    history.push(`/wiki/${wiki.path}`);
  };
  
  return (
    <div>
      <div className="com_header">
        <div className="com_title">Wiki</div>
        <div className="com_ops">
          <div className="com_op"><WikiCreateButton /></div>
        </div>
      </div>
      <div className="com_body">
        <div>
          <h2>Recent</h2>
          <div className="wiki_list">
            {wikis.map((wiki: BasicWiki, index: number) => (
              <div className="wiki_list_item" key={wiki.id} onClick={() => clickWiki(wiki)}>
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
