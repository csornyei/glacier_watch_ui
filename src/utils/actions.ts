import type { ActionFunctionArgs } from "react-router";

import type { ActionResponse } from "./types";
import getDataSource from "./dataSourceFactory";

const ds = getDataSource();

async function updateSceneStatus({
  request,
}: ActionFunctionArgs): Promise<ActionResponse> {
  const formData = await request.formData();
  const sceneId = formData.get("scene_id");
  const newStatus = formData.get("new_status");
  const apiKey = formData.get("api_key");

  if (!sceneId) {
    return {
      success: false,
      message: "Scene ID is required",
    };
  }

  if (!newStatus || !apiKey) {
    return {
      success: false,
      message: "New status and API key are required",
    };
  }

  try {
    await ds.patchSceneStatus(
      sceneId.toString(),
      newStatus.toString(),
      apiKey.toString()
    );

    console.log("Updating scene status:", {
      scene_id: sceneId,
      new_status: newStatus,
      api_key: apiKey,
    });

    return {
      success: true,
      message: "Scene status updated successfully",
    };
  } catch (error) {
    console.error("Error updating scene status:", error);
    return {
      success: false,
      message: "An error occurred while updating the scene status",
    };
  }
}

export default {
  updateSceneStatus,
};
