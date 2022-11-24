import WikiList from "./WikiList";
import WikiDetail from "./WikiDetail";
import "./WikiStyle.css";

export interface WikiProps {
  name?: string
}

export default (props: WikiProps) => {
  if (!props.name || props.name.trim().length < 1) {
    return <WikiList />
  }
  
  return <WikiDetail name={props.name} mode="wiki" />
};
