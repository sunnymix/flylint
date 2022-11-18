
import CatalogTree from "./tree/CatalogTree";
import "./CatalogStyle.css";

export interface CatalogProps {
  key?: string,
};

export const Catalog = (props: CatalogProps) => {

  return (
    <div>
      <CatalogTree className="catalog_tree" key={props.key} />
    </div>
  );
};

export default Catalog;
