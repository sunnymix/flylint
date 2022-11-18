
import Wiki from "@/components/wiki/Wiki";
import { useRouteMatch } from "umi";

export default () => {
  const route = useRouteMatch();
  const params: any = route.params;
  return <Wiki path={params.path} />
};
