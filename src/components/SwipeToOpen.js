import React, { useState, useRef } from "react";
import "./SwipeToOpen.css";
import campushunt_logo from "../assets/campushunt_logo.png";

const SwipeToOpen = ({ onSwipeComplete }) => {
  const ballWidth = 25; // Ball width
  const margin = 5; // Margin from edges
  const [ballPosition, setBallPosition] = useState(margin); // Start 5px from the left edge
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const newPosition = Math.min(
      Math.max(margin, e.clientX - containerRef.current.offsetLeft), // Start from margin
      containerWidth - ballWidth - margin // End at container width minus ball width and margin
    );

    setBallPosition(newPosition);

    // Trigger swipe complete if the ball reaches 90% of the container width
    if (newPosition >= containerWidth - ballWidth - margin) {
      onSwipeComplete();
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    // Prevent default behavior to avoid text selection
    e.preventDefault();
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const swipeDistance = ballPosition - margin; // Calculate the distance moved from the starting position
    const swipeThreshold = containerWidth - ballWidth - margin; // Define the threshold

    // Check if the ball has been dragged far enough to trigger completion
    if (swipeDistance >= swipeThreshold) {
      onSwipeComplete(); // Trigger completion if the threshold is reached
    } else {
      setBallPosition(margin); // Reset to start position if not
    }
  };

  return (
    <div className="swipe-container">
      {" "}
      {/* Parent container for centering */}
      <img src={campushunt_logo} alt="" className="campuslogo" />
      <h2>CampusHunt</h2>
      <div
        className="ball-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleMouseDown} // Enable dragging from the container
      >
        <div
          className="ball"
          style={{ transform: `translate(${ballPosition}px, -50%)` }} // Adjust the transform for centering
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default SwipeToOpen;
