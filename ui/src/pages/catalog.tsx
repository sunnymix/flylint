
import Catalog from "@/components/catalog/Catalog";
import { SELECTED_KEYS } from "@/components/catalog/tree/CatalogTree";
import { useEffect, useState } from "react";
import { history, useRouteMatch } from "umi";

const getLocalName = () => {
  const localNames = JSON.parse(localStorage.getItem(SELECTED_KEYS) || "[]") || [];
  if (!localNames || localNames.length == 0) {
    return "";
  }

  return localNames[0];
}

export default () => {
  const route = useRouteMatch();
  const params: any = route.params;
  
  useEffect(() => {
    if (!params.name) {
      setTimeout(() => {
        const localName = getLocalName();
        if (localName) {
          history.push(`/catalog/${localName}`);
        }
      }, 50);
    }
  }, []);

  return <Catalog defaultName={params.name} />;
};
