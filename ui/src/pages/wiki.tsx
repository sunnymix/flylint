
import WikiList from "@/components/wiki/list/WikiList";
import WikiDetail from "@/components/wiki/detail/WikiDetail";
import { useRouteMatch } from "umi";

export default () => {
  const route = useRouteMatch();
  const params: any = route.params;
  // wiki detail
  if (params.path && params.path.length > 0) {
    return <WikiDetail path={params.path} />
  }
  
  return (
    <WikiList />
  );
};
