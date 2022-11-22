
import Catalog from "@/components/catalog/Catalog";
import LocalStore from "@/components/common/LocalStore";
import { useEffect, useState } from "react";
import { history, useRouteMatch } from "umi";

export default () => {
  const route = useRouteMatch();
  const params: any = route.params;
  
  useEffect(() => {
    if (!params.name) {
      setTimeout(() => {
        const localNames = LocalStore.getCatalogSelectKeys();
        if (!localNames || !localNames.length) {
          return;
        }
        history.push(`/catalog/${localNames[0]}`);
      }, 0);
    }
  }, []);

  return <Catalog defaultName={params.name} />;
};
