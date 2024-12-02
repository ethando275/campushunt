import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import axios from "../api/axiosInstance";
import "./GuessResults.css";

const containerStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
};

// Princeton University coordinates (for fallback center)
const center = {
  lat: 40.3431,
  lng: -74.6551,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  mapTypeControl: false,
  clickableIcons: false,
  mapTypeId: "roadmap",
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ clickable: false }],
    },
  ],
};

const GuessResults = () => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { originalLocation, guessLocation } = location.state || {};
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(15);

  // Calculate distance between two points using the Haversine formula
  const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return 0;

    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get("/api/maps/key");
        if (response.data.apiKey) {
          setApiKey(response.data.apiKey);
        } else {
          setError("No API key found");
        }
      } catch (error) {
        console.error("Error fetching Google Maps API key:", error);
        setError("Failed to load map");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();

    // Calculate map center and zoom if both locations exist
    if (originalLocation && guessLocation) {
      const centerLat = (originalLocation.lat + guessLocation.lat) / 2;
      const centerLng = (originalLocation.lng + guessLocation.lng) / 2;
      setMapCenter({ lat: centerLat, lng: centerLng });

      // Calculate appropriate zoom based on distance
      const distance = calculateDistance(originalLocation, guessLocation);
      if (distance < 100) setMapZoom(18);
      else if (distance < 500) setMapZoom(16);
      else setMapZoom(15);
    }
  }, [originalLocation, guessLocation]);

  if (!originalLocation || !guessLocation) {
    navigate("/princeton_menu");
    return null;
  }

  if (error) {
    return <div className="map-error">{error}</div>;
  }

  if (isLoading) {
    return <div className="map-loading">Loading map...</div>;
  }

  const distance = calculateDistance(originalLocation, guessLocation);

  return (
    <div className="guess-results-container">
      <button
        className="back-button"
        onClick={() => navigate("/princeton_menu")}
      >
        Back to Menu
      </button>
      <div className="map-container">
        {apiKey && (
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter || center}
              zoom={mapZoom}
              options={mapOptions}
            >
              <Marker
                position={originalLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: { width: 40, height: 40 },
                  labelOrigin: { x: 20, y: -10 },
                }}
                label={{
                  text: "Original",
                  color: "#C00",
                  fontWeight: "bold",
                }}
              />
              <Marker
                position={guessLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: { width: 40, height: 40 },
                  labelOrigin: { x: 20, y: -10 },
                }}
                label={{
                  text: "Your Guess",
                  color: "#00C",
                  fontWeight: "bold",
                }}
              />
              <Polyline
                path={[originalLocation, guessLocation]}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1.0,
                  strokeWeight: 2,
                }}
              />
            </GoogleMap>
          </LoadScript>
        )}
      </div>
      <div className="results-info">
        <h2>Distance: {distance} meters</h2>
        <div className="coordinates-info">
          <p>
            Original Location: {originalLocation.lat.toFixed(6)}°N,{" "}
            {originalLocation.lng.toFixed(6)}°W
          </p>
          <p>
            Your Guess: {guessLocation.lat.toFixed(6)}°N,{" "}
            {guessLocation.lng.toFixed(6)}°W
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuessResults;
