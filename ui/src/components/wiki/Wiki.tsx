import WikiList from "./WikiList";
import "./WikiStyle.css";
import Catalog from "../catalog/Catalog";
import LocalStore from '@/components/common/LocalStore';

export interface WikiProps {
  name?: string
}

export default (props: WikiProps) => {

  if (props.name) {
    LocalStore.setCatalogSelectedKeys([props.name]);
  }
  
  return <Catalog name={props.name} refresh={'init'} />;
};
