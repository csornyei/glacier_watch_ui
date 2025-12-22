import { useRouteLoaderData } from "react-router";

import type { SceneDetails } from "../utils/types";

import UpdateSceneForm from "../components/scene/UpdateSceneForm";
import SceneDetailsTable from "../components/scene/SceneDetailsTable";
import { isApiSource } from "../utils/dataSourceFactory";

export default function ScenePage() {
  const sceneDetails = useRouteLoaderData<{ scene: SceneDetails }>("scene");

  if (!sceneDetails) {
    return <div>Loading...</div>;
  }

  const scene = sceneDetails.scene;

  return (
    <div>
      <h2>Scene:</h2>
      <h3>{scene.scene_id}</h3>
      <SceneDetailsTable scene={scene} />
      {isApiSource() && <UpdateSceneForm sceneId={scene.scene_id} />}
    </div>
  );
}
