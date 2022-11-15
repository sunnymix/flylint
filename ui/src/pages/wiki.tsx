
import WikiList from "@/components/wiki/list/WikiList";
import WikiDetail from "@/components/wiki/detail/WikiDetail";
import { useRouteMatch } from "umi";

export default () => {
  const route = useRouteMatch();
  const params: any = route.params;

  // wiki list
  if (!params.path || params.path.length < 1) {
    return <WikiList />
  }
  
  // wiki detail
  return <WikiDetail path={params.path} />
};
