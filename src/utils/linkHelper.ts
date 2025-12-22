export const linkHelper = {
  root: () => `/`,
  project: (projectId: string) => `/p/${projectId}`,
  glacier: (projectId: string, glacierId: string) =>
    `/p/${projectId}/glacier/${glacierId}`,
  scene: (projectId: string, sceneId: string) =>
    `/p/${projectId}/scene/${sceneId}`,
};
