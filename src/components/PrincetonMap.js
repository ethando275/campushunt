import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "../api/axiosInstance";
import "./PrincetonMap.css";

const containerStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
};

// Princeton University coordinates
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

const PrincetonMap = ({ onLocationSelect }) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
      }
    };

    fetchApiKey();
  }, []);

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(newLocation);
    if (onLocationSelect) {
      onLocationSelect(newLocation);
    }
  };

  const formatCoordinates = (location) => {
    if (!location) return "";
    return `Selected Location: (${location.lat.toFixed(
      4
    )}, ${location.lng.toFixed(4)})`;
  };

  if (error) {
    return <div className="map-error">{error}</div>;
  }

  if (!apiKey) {
    return <div className="map-loading">Loading map...</div>;
  }

  return (
    <div
      className="map-wrapper"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {selectedLocation && (
        <div className="coordinates-display">
          {formatCoordinates(selectedLocation)}
        </div>
      )}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={16}
          options={mapOptions}
          onClick={handleMapClick}
        >
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              animation={window.google.maps.Animation.DROP}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default PrincetonMap;
