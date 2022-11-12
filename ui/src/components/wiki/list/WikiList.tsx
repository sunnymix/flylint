import { forwardRef, useEffect, useState } from "react";
import WikiApi from "../api/WikiApi";
import { BasicWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiListStyle.css";

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

  const [wikis, setWikis] = useState<BasicWiki[]>([]);

  useEffect(() => {
    WikiApi.basicQuery('', (wikis: BasicWiki[]) => {
      setWikis(wikis);
    });
  }, []);

  return (
    <div>
      <div className="component_title">Wiki</div>
      <div className="wiki_list_title">Recent</div>
      <div className="wiki_list">
        {wikis.map((wiki: BasicWiki, index: number) => (
          <div className="wiki" key={wiki.id}>
            <div className="wiki_title">{wiki.title}</div>
            <div className="wiki_created">{Time.formatDate(wiki.created)}</div>
          </div>
        ))}
      </div>
    </div>
  )
});
