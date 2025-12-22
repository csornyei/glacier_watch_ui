import { Button, Container, NativeSelect, TextInput } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { AllSceneStatuses, SceneStatus } from "../../utils/types";

type UpdateSceneFormProps = {
  sceneId: string;
  defaultStatus?: AllSceneStatuses;
};

export default function UpdateSceneForm({
  sceneId,
  defaultStatus = "processing",
}: UpdateSceneFormProps) {
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  const [newStatus, setNewStatus] = useState(defaultStatus);
  const [apiKey, setApiKey] = useState("");
  const lastRevalidatedKeyRef = useRef<string | null>(null);

  const isSubmitting = fetcher.state !== "idle";
  const errorMessage =
    fetcher.data && !fetcher.data.success ? fetcher.data.message : null;

  useEffect(() => {
    if (fetcher.state !== "idle") return;
    if (!fetcher.data || !fetcher.data.success) return;

    const key = `${sceneId}:${newStatus}:${apiKey ? "hasKey" : "noKey"}`;

    if (lastRevalidatedKeyRef.current === key) return;

    lastRevalidatedKeyRef.current = key;
    revalidator.revalidate();
  }, [fetcher.state, fetcher.data, revalidator, sceneId, newStatus, apiKey]);

  return (
    <Container>
      <h3>Update Status</h3>
      <fetcher.Form method="post">
        <input type="hidden" name="scene_id" value={sceneId} />
        <div>
          <NativeSelect
            label="Status"
            description="Select the new status for the scene"
            data={[
              { value: "queued_for_download", label: "Queued for Download" },
              {
                value: "queued_for_processing",
                label: "Queued for Processing",
              },
              { value: "processed", label: "Processed" },
            ]}
            name="new_status"
            value={newStatus}
            onChange={(event) =>
              setNewStatus(event.currentTarget.value as SceneStatus)
            }
          />
        </div>
        <div>
          <TextInput
            label="API Key"
            description="Enter your API key to authorize the status update"
            placeholder="Your API Key"
            value={apiKey}
            name="api_key"
            onChange={(event) => setApiKey(event.currentTarget.value)}
          />
        </div>
        {errorMessage && (
          <div style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
            {errorMessage}
          </div>
        )}
        <div>
          <Button mt="md" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </fetcher.Form>
    </Container>
  );
}
