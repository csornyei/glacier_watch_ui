import type { LoaderFunctionArgs } from "react-router";

import getDataSource from "./dataSourceFactory";
import type { GlacierLoaderResponse, GlacierResponse } from "./types";

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
    const glacierIds = compare.split(",").filter((id) => id.length > 0);
    if (glacierIds.length === 0) {
      return { ...glacier, compare_glacier: [] };
    } else {
      console.log("Comparing glaciers:", glacierIds);
      const compareGlaciers = await Promise.all(
        glacierIds.map((glacierId) =>
          ds.getGlacierDetails(params.project_id!, glacierId)
        )
      );
      console.log("Loaded compare glaciers:", compareGlaciers);
      return {
        ...glacier,
        compare_glacier: compareGlaciers.filter(
          (g) => g !== null
        ) as GlacierResponse[],
      };
    }
  }

  return { ...glacier, compare_glacier: [] };
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
