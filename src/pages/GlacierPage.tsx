import { useRouteLoaderData } from "react-router";

import type { GlacierLoaderResponse } from "../utils/types";
import GlacierPageHeader from "../components/glacier/Header";
import GlacierMap from "../components/glacier/Map";
import GlacierCharts from "../components/glacier/Charts";

const getGlacierName = (glacierName: string | null, glacierId: string) => {
  return glacierName ? glacierName : `Unnamed Glacier (${glacierId})`;
};

export default function GlacierPage() {
  const glacierDetails = useRouteLoaderData<GlacierLoaderResponse>("glacier");

  if (!glacierDetails) {
    return <div>Loading...</div>;
  }

  const {
    glacier: mainGlacier,
    timeseries: mainTimeseries,
    compare_glacier: otherGlaciers,
  } = glacierDetails;

  const mapGeojsons = [
    {
      key: mainGlacier.glacier_id,
      data: mainGlacier.geometry,
    },
    ...otherGlaciers.map((otherGlacier) => ({
      key: otherGlacier.glacier.glacier_id,
      data: otherGlacier.glacier.geometry,
    })),
  ];

  return (
    <div>
      <GlacierPageHeader
        mainGlacierDetails={{
          glacierName: getGlacierName(mainGlacier.name, mainGlacier.glacier_id),
          areaM2: mainGlacier.area_m2,
        }}
        compareGlacierDetails={otherGlaciers.map((otherGlacier) => ({
          glacierName: getGlacierName(
            otherGlacier.glacier.name,
            otherGlacier.glacier.glacier_id
          ),
          areaM2: otherGlacier.glacier.area_m2,
        }))}
      />
      <GlacierMap geojsons={mapGeojsons} />
      <GlacierCharts
        mainGlacierName={
          mainGlacier.name
            ? mainGlacier.name
            : `Unnamed Glacier (${mainGlacier.glacier_id})`
        }
        mainGlacierTimeseries={mainTimeseries}
        otherGlaciers={otherGlaciers.map((otherGlacier) => ({
          name: getGlacierName(
            otherGlacier.glacier.name,
            otherGlacier.glacier.glacier_id
          ),
          timeseries: otherGlacier.timeseries,
        }))}
      />
    </div>
  );
}
