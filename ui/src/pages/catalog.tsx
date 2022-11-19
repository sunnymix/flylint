
import Catalog from "@/components/catalog/Catalog";
import { SELECTED_KEYS } from "@/components/catalog/tree/CatalogTree";
import { useEffect, useState } from "react";
import { history } from "umi";

export const CATALOG_PATH = "/catalog/";

const getName = (href: string): string => {
  if (!href || !href.trim()) {
    return "";
  }
  
  const nameIndex = href.indexOf(CATALOG_PATH);
  if (nameIndex < 0) {
    return "";
  }

  var name = href.substring(nameIndex + CATALOG_PATH.length);
  return name;
};

const getLocalName = () => {
  var localNames = JSON.parse(localStorage.getItem(SELECTED_KEYS) || "[]") || [];
  if (!localNames || localNames.length == 0) {
    return "";
  }

  return localNames[0];
}

export default () => {
  const [defaultName, setDefaultName] = useState<string>(getName(location.href) || getLocalName());

  useEffect(() => {
    const locationName = getName(location.href);

    if (!locationName) {
      const localName = getLocalName();
      if (localName) {
        localStorage.setItem(SELECTED_KEYS, JSON.stringify([localName]));
        history.push(`/catalog/${localName}`);
        return;
      }
    }

    if (locationName === defaultName) {
      return;
    }
    
    localStorage.setItem(SELECTED_KEYS, JSON.stringify([locationName]));
    setDefaultName(locationName);
  }, [location.href]);
  
  return <Catalog defaultName={defaultName} />;
};
