import { useRouteLoaderData } from "react-router";

import type { GlacierLoaderResponse, GlacierResponse } from "../utils/types";
import ResponsiveContainer from "../components/charts/ResponsiveContainer";
import GlacierPageHeader from "../components/glacier/Header";
import GlacierMap from "../components/glacier/Map";

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
      <div>
        <h3>Time Series Data</h3>

        <ResponsiveContainer
          points={glacierDetails.timeseries.map((ts) => {
            return {
              x: new Date(ts.acquisition_date),
              y: Number((ts.snow_area_m2 / 1_000_000).toFixed(2)),
            };
          })}
          label="Snow Area (km²)"
        />
        <ResponsiveContainer
          points={glacierDetails.timeseries.map((ts) => ({
            x: new Date(ts.acquisition_date),
            y: Math.round(ts.snowline_elevation_m),
          }))}
          label="Snowline Elevation (m)"
          customYThreshold={20}
        />
        <ResponsiveContainer
          points={glacierDetails.timeseries.map((ts) => ({
            x: new Date(ts.acquisition_date),
            y: Number(ts.snow_area_fraction.toFixed(2)),
          }))}
          label="Snow Area Fraction"
        />
      </div>
    </div>
  );
}
