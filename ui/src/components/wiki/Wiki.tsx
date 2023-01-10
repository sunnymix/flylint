import WikiList from "./WikiList";
import "./WikiStyle.css";
import Catalog from "../catalog/Catalog";
import LocalStore from '@/components/common/LocalStore';

export interface WikiProps {
  name?: string
}

export default (props: WikiProps) => {
  
  if (!props.name || props.name.trim().length < 1) {
    return <WikiList />;
  }

  LocalStore.setCatalogSelectedKeys([props.name]);
  
  return <Catalog defaultName={props.name} refreshSignal={'init'} />;
};
