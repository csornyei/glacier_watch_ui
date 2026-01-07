import { useRouteLoaderData } from "react-router";

import type { GlacierLoaderResponse, GlacierResponse } from "../utils/types";
import GlacierPageHeader from "../components/glacier/Header";
import GlacierMap from "../components/glacier/Map";
import GlacierCharts from "../components/glacier/Charts";

export default function GlacierPage() {
  const glacierDetails = useRouteLoaderData<GlacierLoaderResponse>("glacier");

  if (!glacierDetails) {
    return <div>Loading...</div>;
  }

  let otherGlacier: GlacierResponse | null = null;
  if (glacierDetails.compare_glacier) {
    otherGlacier = glacierDetails.compare_glacier;
  }

  const mapGeojsons = [
    {
      key: glacierDetails.glacier.glacier_id,
      data: glacierDetails.glacier.geometry,
    },
  ];
  if (otherGlacier) {
    mapGeojsons.push({
      key: otherGlacier.glacier.glacier_id,
      data: otherGlacier.glacier.geometry,
    });
  }

  return (
    <div>
      <GlacierPageHeader
        mainGlacierDetails={{
          glacierName: glacierDetails.glacier.name
            ? glacierDetails.glacier.name
            : "Unnamed Glacier",
          areaM2: glacierDetails.glacier.area_m2,
        }}
        compareGlacierDetails={
          otherGlacier
            ? {
                glacierName: otherGlacier.glacier.name
                  ? otherGlacier.glacier.name
                  : "Unnamed Glacier",
                areaM2: otherGlacier.glacier.area_m2,
              }
            : undefined
        }
      />
      <GlacierMap geojsons={mapGeojsons} />
      <GlacierCharts
        mainGlacierName={
          glacierDetails.glacier.name
            ? glacierDetails.glacier.name
            : `Unnamed Glacier (${glacierDetails.glacier.glacier_id})`
        }
        mainGlacierTimeseries={glacierDetails.timeseries}
        otherGlaciers={
          otherGlacier
            ? [
                {
                  name: otherGlacier.glacier.name
                    ? otherGlacier.glacier.name
                    : `Unnamed Glacier (${otherGlacier.glacier.glacier_id})`,
                  timeseries: otherGlacier.timeseries,
                },
              ]
            : []
        }
      />
    </div>
  );
}
