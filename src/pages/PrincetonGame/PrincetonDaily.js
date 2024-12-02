import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PrincetonMap from "../../components/PrincetonMap";
import "./PrincetonDaily.css";

const PrincetonDaily = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dailyPicture } = location.state || {};
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Daily Picture Data:", dailyPicture);
  }, [dailyPicture]);

  if (!dailyPicture) {
    console.log("No daily picture data found");
    navigate("/princeton_menu");
    return null;
  }

  // Get coordinates from the array
  console.log("Raw coordinates:", dailyPicture.coordinates);
  const coordinates = dailyPicture.coordinates || null;
  console.log("Coordinates:", coordinates);
  const latitude = coordinates ? coordinates[0] : null;
  const longitude = coordinates ? coordinates[1] : null;
  console.log("Latitude:", latitude, "Longitude:", longitude);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleSubmitGuess = () => {
    if (!selectedLocation) {
      setError("Please select a location on the map first!");
      return;
    }

    navigate("/guess-results", {
      state: {
        originalLocation: {
          lat: latitude,
          lng: longitude,
        },
        guessLocation: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        },
      },
    });
  };

  return (
    <div className="princeton-daily-container">
      <div className="game-header">
        <h1>Princeton Daily Hunt</h1>
        <p>Find this location on campus!</p>
        {coordinates && (
          <p className="coordinates">
            Original Location: {latitude.toFixed(6)}°N, {longitude.toFixed(6)}°W
          </p>
        )}
      </div>
      <div className="game-content">
        <div className="daily-picture-section">
          <img
            src={dailyPicture.url}
            alt="Daily location"
            className="daily-picture"
          />
        </div>
        <div className="map-section">
          <PrincetonMap onLocationSelect={handleLocationSelect} />
          <button
            className="submit-guess-button"
            onClick={handleSubmitGuess}
            disabled={!selectedLocation}
          >
            Submit Guess
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default PrincetonDaily;
