import { useRouteLoaderData } from "react-router";

import type { GlacierResponse } from "../utils/types";
import ResponsiveContainer from "../components/charts/ResponsiveContainer";
import Map from "../components/Map";
import { AspectRatio } from "@mantine/core";

export default function GlacierPage() {
  const glacierDetails = useRouteLoaderData<GlacierResponse>("glacier");

  if (!glacierDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{glacierDetails.glacier.name}</h2>
      <p>
        Area: {(glacierDetails.glacier.area_m2 / 1_000_000).toFixed(2)}km
        <sup>2</sup>
      </p>
      <AspectRatio ratio={16 / 9} mb="md">
        <Map geojsonData={glacierDetails.glacier.geometry} />
      </AspectRatio>
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
