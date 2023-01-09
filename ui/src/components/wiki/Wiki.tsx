import WikiList from "./WikiList";
import WikiPage from "./WikiPage";
import "./WikiStyle.css";

export interface WikiProps {
  name?: string
}

export default (props: WikiProps) => {
  if (!props.name || props.name.trim().length < 1) {
    return <WikiList />
  }
  
  return <WikiPage name={props.name} mode="wiki" />
};
