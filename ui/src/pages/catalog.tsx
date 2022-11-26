import Catalog from '@/components/catalog/Catalog';
import LocalStore from '@/components/common/LocalStore';
import { useCallback, useEffect, useState } from 'react';
import { history, useRouteMatch } from 'umi';
import Time from '@/components/common/Time';

export default () => {
  const route = useRouteMatch();
  const params: any = route.params;

  const [refreshSignal, setRefreshSignal] = useState<string>(Time.refreshSignal());

  const handleEmptyName = useCallback(() => {
    setTimeout(() => {
      const localNames = LocalStore.getCatalogSelectKeys();
      if (!localNames || !localNames.length) {
        return;
      }
      history.push(`/catalog/${localNames[0]}`);
    }, 0);
  }, []);
  
  useEffect(() => {
    if (!params.name) {
      return handleEmptyName();
    }

    LocalStore.setCatalogSelectedKeys([params.name]);
    setRefreshSignal(Time.refreshSignal());
  }, [params.name]);

  return <Catalog defaultName={params.name} refreshSignal={refreshSignal} />;
};
