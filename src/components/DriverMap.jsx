import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

function FollowDriver({ position }) {
  const map = useMap();
  const firstTimeRef = useRef(true);

  useEffect(() => {
    if (!position) return;

    const zoomLevel = 18; // closer like Google Maps [web:324]

    if (firstTimeRef.current) {
      map.setView(position, zoomLevel);
      firstTimeRef.current = false;
    } else {
      map.flyTo(position, zoomLevel, {
        duration: 1.0,
      }); // smooth follow [web:327][web:330]
    }
  }, [position, map]);

  return null;
}

export default function DriverMap({ tripStarted }) {
  const [position, setPosition] = useState([15.8497, 74.4977]); // Belagavi
  const [locationText, setLocationText] = useState("Waiting for GPS...");
  const watchIdRef = useRef(null);
  const startedRef = useRef(false);

  // start watching location
  const startWatching = () => {
    if (!navigator.geolocation) {
      setLocationText("Geolocation not supported");
      return;
    }

    if (watchIdRef.current !== null) return; // already running

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];

        setPosition((prev) => {
          const [prevLat, prevLng] = prev;
          const [lat, lng] = newPos;

          // ignore tiny noise
          const movedEnough =
            Math.abs(prevLat - lat) > 0.00005 ||
            Math.abs(prevLng - lng) > 0.00005;

          return movedEnough ? newPos : prev;
        });

        setLocationText("Driver current location");
      },
      (err) => {
        console.error(err);
        setLocationText("Location error / permission denied");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    ); // [web:321][web:329][web:331]

    watchIdRef.current = id;
  };

  // stop watching location
  const stopWatching = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // react to tripStarted prop
  useEffect(() => {
    startedRef.current = tripStarted;

    if (tripStarted) {
      startWatching();
    } else {
      stopWatching();
      setLocationText("Trip ended");
    }

    return () => {
      stopWatching();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripStarted]);

  // handle screen sleep / tab hide -> resume when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && startedRef.current) {
        // trip is supposed to be ON, ensure watcher is running
        startWatching();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={18}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>{locationText}</Popup>
      </Marker>

      <FollowDriver position={position} />
    </MapContainer>
  );
}