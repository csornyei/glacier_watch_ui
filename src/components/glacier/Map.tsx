import { AspectRatio } from "@mantine/core";
import Map from "../Map";
import type { GeojsonData } from "../../utils/types";

interface MapProps {
  geojsons: GeojsonData[];
}

export default function GlacierMap({ geojsons }: MapProps) {
  return (
    <AspectRatio ratio={16 / 9} mb="md">
      <Map geojsonData={geojsons} />
    </AspectRatio>
  );
}
