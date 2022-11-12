
import { forwardRef, useEffect, useState } from "react";
import WikiApi from "../api/WikiApi";
import { DetailWiki } from "../model/WikiModel";
import Time from "@/components/common/Time";
import "./WikiDetailStyle.css";

export interface WikiDetailProps {
  path: string,
  refreshSignal?: string,
};

export default forwardRef((props: WikiDetailProps, ref) => {

  const [wiki, setWiki] = useState<DetailWiki|null>(null);

  useEffect(() => {
    if (!props.path) {
      setWiki(null);
      return;
    }

    WikiApi.detail(props.path, (wiki: DetailWiki) => {
      if (!wiki) {
        setWiki(null);
        return;
      }

      setWiki(wiki);
    });

  }, [props.path, props.refreshSignal]);

  if (!wiki) {
    return <></>;
  }

  return (
    <div>
      <div className="component_title">{wiki.title}</div>
      <div className="wiki_time">{Time.formatDate(wiki.created)}</div>
      <div>
        <div className="wiki_content" dangerouslySetInnerHTML={{ __html: wiki.content }}></div>
      </div>
    </div>
  );
});
