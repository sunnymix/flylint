import WikiList from "./WikiList";
import "./WikiStyle.css";
import Catalog from "../catalog/Catalog";
import LocalStore from '@/components/common/LocalStore';

export interface WikiProps {
  name?: string
}

export default (props: WikiProps) => {

  LocalStore.setCatalogSelectedKeys([]);
  
  return <Catalog defaultName={props.name} refreshSignal={'init'} />;
};
