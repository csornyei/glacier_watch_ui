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

interface MapProps {
  markers?: { position: [number, number]; popupText: string | JSX.Element }[];
  bounds?: [[number, number], [number, number]];
  center?: [number, number];
  geojsonData?: GeoJsonObject;
}

function FitToGeoJSON({ geojson }: { geojson: GeoJsonObject }) {
  const map = useMap();

  useEffect(() => {
    const layer = L.geoJSON(geojson);
    const b = layer.getBounds();
    if (b.isValid()) {
      map.fitBounds(b, { padding: [20, 20] });
    }
  }, [geojson, map]);

  return null;
}

export default function Map({
  markers,
  bounds,
  center,
  geojsonData,
}: MapProps) {
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
          <FitToGeoJSON geojson={geojsonData} />
          <GeoJSON data={geojsonData} />
        </>
      )}
    </MapContainer>
  );
}
