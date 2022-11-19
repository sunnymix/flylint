
import CatalogTree from "./tree/CatalogTree";
import "./CatalogStyle.css";
import { useState } from "react";
import WikiDetail from "../wiki/detail/WikiDetail";
import { history } from "umi";
import { SELECTED_KEYS } from "./tree/CatalogTree";

export interface CatalogProps {
  defaultName?: string
};

export const Catalog = (props: CatalogProps) => {

  const onSelect = (names: string[]) => {
    history.push(`/catalog/${names[0]}`);
  };

  return (
    <div>
      <CatalogTree className="catalog_tree" width={400} onSelect={onSelect} />
      <div className="catalog_body" style={{marginLeft: 400}}>
        <div className="wiki">
          {props.defaultName && <WikiDetail name={props.defaultName} mode="catalog" />}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
