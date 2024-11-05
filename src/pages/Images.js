import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./HomePage.css";
import "./Images.css";
import SquareImageGrid from "../components/SquareImageGrid";

const Images = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Images");
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentID, setCurrentID] = useState("");

  // Refs for the input fields
  const descriptionRef = useRef(null);
  const latitudeRef = useRef(null);
  const longitudeRef = useRef(null);

  useEffect(() => {
    setSelectedTab("Images");

    const fetchImages = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_urls");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleSelectTab = (tab) => {
    if (tab === "Log Out") {
      handleLogout();
    } else {
      setSelectedTab(tab);
    }
  };

  const deleteImage = async (url, public_id) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/deleteImage", {
        data: { public_id },
      });
      console.log("Delete response:", response.data);
      setImages(images.filter((image) => image.url !== url));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const editMeta = (public_id) => {
    setCurrentID(public_id); // Set the current URL for the image
    setShowModal(true);
  };

  const handleSaveMeta = async () => {
    // Get input values directly from refs
    const description = descriptionRef.current.value;
    const latitude = parseFloat(latitudeRef.current.value) || "";
    const longitude = parseFloat(longitudeRef.current.value) || "";
    console.log(currentID);

    try {
      await axios.post("http://127.0.0.1:5000/editImage", {
        currentID,
        description,
        latitude,
        longitude,
      });

      alert("Metadata updated successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error saving metadata:", error);
      alert("Failed to update metadata.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentID(""); // Reset URL
  };

  return (
    <div className="screen">
      <div className="left">
        <NavBar onSelectTab={handleSelectTab} selectedTab={selectedTab} />
      </div>
      <div className="right">
        <SquareImageGrid
          images={images}
          onDelete={deleteImage}
          onImageClick={editMeta}
        />
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Metadata</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Enter description"
            ref={descriptionRef}
            className="form-control mb-2"
          />
          <input
            type="text"
            placeholder="Enter latitude"
            ref={latitudeRef}
            className="form-control mb-2"
          />
          <input
            type="text"
            placeholder="Enter longitude"
            ref={longitudeRef}
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveMeta}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Images;
