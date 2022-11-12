import { forwardRef, useEffect, useState } from "react";
import WikiApi from "../api/WikiApi";
import { BasicWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiListStyle.css";
import { history } from "umi";

/**
 * WkikList 组件属性
 */
export interface WikiListProps {
  refreshSignal?: string,
}

/**
 * WikiList 组件
 */
export default forwardRef((props: WikiListProps, ref) => {

  /**
   * 属性：wikis 数据
   */
  const [wikis, setWikis] = useState<BasicWiki[]>([]);

  /**
   * 响应：初始化
   */
  useEffect(() => {
    WikiApi.basicQuery('', (wikis: BasicWiki[]) => {
      setWikis(wikis);
    });
  }, []);

  /**
   * 动作：点击 wiki
   * @param wiki wiki 数据
   */
  const clickWiki = (wiki: BasicWiki) => {
    history.push(`/wiki/${wiki.path}`);
  };

  /**
   * 组件
   */
  return (
    <div>
      <div className="component_title">Wiki</div>
      <div className="wiki_list_title">Recent</div>
      <div className="wiki_list">
        {wikis.map((wiki: BasicWiki, index: number) => (
          <div className="wiki" key={wiki.id} onClick={() => clickWiki(wiki)}>
            <div className="wiki_title">{wiki.title}</div>
            <div className="wiki_created">{Time.formatDate(wiki.created)}</div>
          </div>
        ))}
      </div>
    </div>
  )
});
