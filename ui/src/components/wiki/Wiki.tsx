import WikiList from "./list/WikiList";
import WikiDetail from "./detail/WikiDetail";

export interface WikiProps {
  name?: string
}

export default (props: WikiProps) => {
  if (!props.name || props.name.trim().length < 1) {
    return <WikiList />
  }
  
  return <WikiDetail name={props.name} />
};
