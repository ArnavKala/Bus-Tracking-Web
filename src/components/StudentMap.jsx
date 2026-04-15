import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FitMap({ studentPos, busPos }) {
  const map = useMap();

  useEffect(() => {
    if (!studentPos || !busPos) return;
    const bounds = L.latLngBounds([studentPos, busPos]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [studentPos, busPos, map]);

  return null;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

function formatETA(distanceKm, speedKmH = 25) {
  const hours = distanceKm / speedKmH;
  const mins = Math.max(1, Math.round(hours * 60));

  const etaTime = new Date(Date.now() + mins * 60000);

  return {
    mins,
    expectedTime: etaTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function StudentMap() {
  const [studentPos, setStudentPos] = useState(null);
  const [busPos, setBusPos] = useState([15.8528, 74.5006]); // temporary demo bus position
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const currentStudentPos = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setStudentPos(currentStudentPos);
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // temporary bus simulation for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setBusPos((prev) => [prev[0] - 0.00015, prev[1] - 0.0001]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!studentPos || !busPos) return;

    const distanceKm = haversineDistance(
      studentPos[0],
      studentPos[1],
      busPos[0],
      busPos[1]
    );

    setDistance(distanceKm.toFixed(2));
    setEta(formatETA(distanceKm, 25));
  }, [studentPos, busPos]);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 1000,
          background: "white",
          padding: "12px 14px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          minWidth: "220px",
        }}
      >
        <h4 style={{ margin: 0, marginBottom: "8px" }}>Bus Tracking</h4>
        <p style={{ margin: "4px 0" }}>
          Distance: <strong>{distance ? `${distance} km` : "Calculating..."}</strong>
        </p>
        <p style={{ margin: "4px 0" }}>
          ETA: <strong>{eta ? `${eta.mins} min` : "Calculating..."}</strong>
        </p>
        <p style={{ margin: "4px 0" }}>
          Expected Time: <strong>{eta ? eta.expectedTime : "Calculating..."}</strong>
        </p>
      </div>

      <MapContainer
        center={studentPos || [15.8497, 74.4977]}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {studentPos && (
          <Marker position={studentPos}>
            <Popup>Student Location</Popup>
          </Marker>
        )}

        {busPos && (
          <Marker position={busPos}>
            <Popup>Bus Location</Popup>
          </Marker>
        )}

        {studentPos && busPos && (
          <Polyline positions={[studentPos, busPos]} color="blue" />
        )}

        {studentPos && busPos && <FitMap studentPos={studentPos} busPos={busPos} />}
      </MapContainer>
    </div>
  );
}