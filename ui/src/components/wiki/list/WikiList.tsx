import { forwardRef, useEffect, useState } from "react";
import WikiApi from "../api/WikiApi";
import { BasicWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiListStyle.css";
import { history } from "umi";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import wiki from "@/pages/wiki";

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

  /**
   * 动作：点击新建 wiki
   */
  const clickNewWiki = () => {
    WikiApi.create((path: string) => {
      history.push(`/wiki/${path}`);
    });
  };

  /**
   * 组件
   */
  return (
    <div>
      <div className="component_header">
        <div className="component_title">Library</div>
        <div className="component_ops">
          <Button className="component_op" size="small" shape="round" onClick={clickNewWiki}>Create</Button>
        </div>
      </div>
      <div className="component_body">
        <div>
          <h2>Subject</h2>
          <p>Empty.</p>
        </div>
        <div>
          <hr/>
          <h2>Wiki</h2>
          <div className="wiki_list">
            {wikis.map((wiki: BasicWiki, index: number) => (
              <div className="wiki" key={wiki.id} onClick={() => clickWiki(wiki)}>
                <div className="wiki_title">{wiki.title}</div>
                <div className="wiki_time">{Time.formatDate(wiki.created)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
});
