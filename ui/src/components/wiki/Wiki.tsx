import WikiList from "./list/WikiList";
import WikiDetail from "./detail/WikiDetail";

export interface WikiProps {
  path?: string
}

export default (props: WikiProps) => {
  if (!props.path || props.path.trim().length < 1) {
    return <WikiList />
  }
  
  return <WikiDetail path={props.path} />
};
