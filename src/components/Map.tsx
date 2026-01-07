import { useEffect, type JSX } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";
import type { GeoJsonObject } from "geojson";
import L from "leaflet";
import type { GeojsonData } from "../utils/types";

interface MapProps {
  markers?: { position: [number, number]; popupText: string | JSX.Element }[];
  bounds?: [[number, number], [number, number]];
  center?: [number, number];
  geojsonData?: GeojsonData[];
}

function FitToGeoJSON({ geojsons }: { geojsons: GeoJsonObject[] }) {
  const map = useMap();

  useEffect(() => {
    if (!geojsons || geojsons.length === 0) {
      return;
    }

    const group = L.featureGroup();

    geojsons.forEach((geojson) => {
      const layer = L.geoJSON(geojson);
      group.addLayer(layer);
    });

    const b = group.getBounds();
    if (b.isValid()) {
      map.fitBounds(b, { padding: [20, 20] });
    }
  }, [geojsons, map]);

  return null;
}

export default function Map({
  markers,
  bounds,
  center,
  geojsonData,
}: MapProps) {
  console.log("Map props - geojsonData:", geojsonData);
  return (
    <MapContainer
      center={bounds ? undefined : center}
      bounds={bounds ? bounds : undefined}
      scrollWheelZoom={false}
      style={{
        height: "500px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers?.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>{marker.popupText}</Popup>
        </Marker>
      ))}
      {geojsonData && (
        <>
          <FitToGeoJSON geojsons={geojsonData.map((d) => d.data)} />
          {geojsonData.map((data) => (
            <GeoJSON key={data.key} data={data.data} />
          ))}
        </>
      )}
    </MapContainer>
  );
}
