
import WikiList from "@/components/wiki/list/WikiList";
import Wiki from "@/components/wiki/wiki/Wiki";
import { useRouteMatch } from "umi";

export default () => {
  const route = useRouteMatch();
  const params: any = route.params;
  if (params.path && params.path.length > 0) {
    return <Wiki path={params.path} />
  }
  return (
    <WikiList />
  );
};
