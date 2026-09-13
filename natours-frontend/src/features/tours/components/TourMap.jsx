import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Vite doesn't resolve Leaflet's default marker image paths on its own —
// without this, markers render as broken/invisible icons.
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// The backend stores coordinates as GeoJSON [lng, lat]; Leaflet wants [lat, lng].
function toLatLng([lng, lat]) {
  return [lat, lng];
}

export default function TourMap({ startLocation, locations = [], tourName }) {
  const points = useMemo(() => {
    const all = [];
    if (startLocation?.coordinates) {
      all.push({ ...startLocation, day: 0, label: 'Starting point' });
    }
    locations.forEach((loc) => {
      if (loc?.coordinates) all.push(loc);
    });
    return all;
  }, [startLocation, locations]);

  if (points.length === 0) return null;

  const bounds = points.map((p) => toLatLng(p.coordinates));
  const center = bounds[0];

  return (
    <div className="h-80 w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-mist-300)] sm:h-96">
      <MapContainer
        bounds={bounds.length > 1 ? bounds : undefined}
        center={bounds.length > 1 ? undefined : center}
        zoom={bounds.length > 1 ? undefined : 9}
        boundsOptions={{ padding: [30, 30] }}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point, i) => (
          <Marker key={i} position={toLatLng(point.coordinates)} icon={defaultIcon}>
            <Popup>
              <strong>{point.label ?? `Day ${point.day}`}</strong>
              <br />
              {point.description ?? point.address ?? tourName}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
