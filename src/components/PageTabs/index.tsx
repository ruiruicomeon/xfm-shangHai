import React from 'react';
import pathToRegexp from 'path-to-regexp';
import _find from 'lodash/find';
import injectChildren from '@/utils/childrenUtils';
import withRouter from 'umi/withRouter';
import router, { RouteData } from 'umi/router';
import ChildrenTabs, { ChildrenTab } from '@/components/ChildrenTabs';

function searchPathIdAndName(childrenPathname: string, originalMenuData: any[]): [string, string] {
  function getPathIdAndName(path: string, menuData: MenuItem[], parent: MenuItem | null) {
    let result: [string, string];
    menuData.forEach(item => {
      // match prefix iteratively
      if (pathToRegexp(`${item.path}(.*)`).test(path)) {
        if (!parent && item.name) {
          result = [item.path, item.name];
        } else if (parent && !parent.component && item.name) {
          // create new tab if item has name and item's parant route has not component
          result = [item.path, item.name];
        }
        // get children pathIdAndName recursively
        if (item.children) {
          result = getPathIdAndName(path, item.children, item) || result;
        }
      }
    });
    return result;
  }
  return getPathIdAndName(childrenPathname, originalMenuData, null) || ['404', 'Error'];
}

function routeTo(targetTab: ChildrenTab) {
  router.push({
    ...targetTab.location,
  });
}

export interface PageTabsProps {
  proRootPath?: string;
  children?: UmiChildren;
  originalMenuData: MenuItem[];
  location: RouteData;
}

function handleTabRefresh(tabKey) {
  const { childrenTabs } = window;
  if (childrenTabs) {
    const { activedTabs } = childrenTabs.state;
    childrenTabs.setState({
      activedTabs: activedTabs.map(item => {
        if (item.key === tabKey) {
          return {
            ...item,
            content: injectChildren(item.content, { key: item.key ? item.key + 1 : 1 }),
            refresh: tabKey.indexOf("_list") > -1 ? false : true,
            // refresh: true
          };
        }
        return item;
      }),
    });
  }
}

function PageTabs(props: PageTabsProps) {
  const { proRootPath = '/', children, originalMenuData, location } = props;

  // return children to redirect if children pathname equal proRootPath
  if (location.pathname === proRootPath) {
    return children;
  }
  const [pathId, pathName] = searchPathIdAndName(location.pathname, originalMenuData);

  const handleTabChange = (keyToSwitch: string, activedTabs: ChildrenTab[]) => {
    const targetTab = _find(activedTabs, { key: keyToSwitch });
    routeTo(targetTab);
  };
  const afterRemoveTab = (removeKey: string, nextTabKey: string, activedTabs: ChildrenTab[]) => {
    const targetTab = _find(activedTabs, { key: nextTabKey });
    routeTo(targetTab);
  };

    handleTabRefresh(pathId);

  return (
    <ChildrenTabs
      activeKey={pathId}
      activeTitle={pathName}
      extraTabProperties={{
        location,
      }}
      handleTabChange={handleTabChange}
      afterRemoveTab={afterRemoveTab}
    >
      {children}
    </ChildrenTabs>
  );
}

export default withRouter(PageTabs as any);
