import type { LoaderFunctionArgs } from "react-router";

import getDataSource from "./dataSourceFactory";
import type { GlacierLoaderResponse } from "./types";

const ds = getDataSource();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function projects(_: LoaderFunctionArgs) {
  const projects = await ds.getProjects();
  return { projects: projects.projects, map_bounds: projects.map_bounds };
}

async function projectDetails({ params }: LoaderFunctionArgs) {
  const projectDetails = await ds.getProjectDetails(params.project_id!);
  console.log("Loaded project details:", projectDetails);
  return projectDetails;
}

async function glacierDetails({
  params,
  request,
}: LoaderFunctionArgs): Promise<GlacierLoaderResponse> {
  const glacier = await ds.getGlacierDetails(
    params.project_id!,
    params.glacier_id!
  );

  if (!glacier) {
    throw new Response("Glacier Not Found", { status: 404 });
  }

  const requestUrl = new URL(request.url);
  const compare = requestUrl.searchParams.get("compare");

  if (compare) {
    const compareGlacier = await ds.getGlacierDetails(
      params.project_id!,
      compare
    );
    return { ...glacier, compare_glacier: compareGlacier };
  }

  return { ...glacier, compare_glacier: null };
}

async function sceneDetails({ params }: LoaderFunctionArgs) {
  const scene = await ds.getSceneDetails(params.project_id!, params.scene_id!);

  console.log("Loaded scene details:", scene);
  return { scene };
}

export default {
  projects,
  projectDetails,
  glacierDetails,
  sceneDetails,
};
