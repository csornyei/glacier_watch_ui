export const linkHelper = {
  root: () => `/`,
  project: (projectId: string) => `/p/${projectId}`,
  glacier: (projectId: string, glacierId: string, compare?: string) => {
    if (compare) {
      return `/p/${projectId}/glacier/${glacierId}?compare=${compare}`;
    }
    return `/p/${projectId}/glacier/${glacierId}`;
  },
  scene: (projectId: string, sceneId: string) =>
    `/p/${projectId}/scene/${sceneId}`,
};

export const parseUrl = () => {
  const href = window.location.href;
  const url = new URL(href);
  const pathSegments = url.pathname.split("/").filter((seg) => seg.length > 0);

  const result: {
    projectId?: string;
    glacierId?: string;
    sceneId?: string;
    compare: string[];
  } = {
    compare: [],
  };

  if (pathSegments.length >= 2 && pathSegments[0] === "p") {
    result.projectId = pathSegments[1];
  }
  if (pathSegments.length >= 4 && pathSegments[2] === "glacier") {
    result.glacierId = pathSegments[3];
  }
  if (pathSegments.length >= 4 && pathSegments[2] === "scene") {
    result.sceneId = pathSegments[3];
  }

  const compareParam = url.searchParams.get("compare");
  if (compareParam) {
    result.compare = compareParam.split(",").filter((val) => val.length > 0);
  }

  return result;
};
