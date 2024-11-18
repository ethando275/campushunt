import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import SquareImageGrid from "../components/SquareImageGrid";
import axiosInstance from "../api/axiosInstance";

const Images = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Images");
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentID, setCurrentID] = useState("");

  const descriptionRef = useRef(null);
  const latitudeRef = useRef(null);
  const longitudeRef = useRef(null);

  useEffect(() => {
    setSelectedTab("Images");
    const fetchImages = async () => {
      try {
        const response = await axiosInstance.get(
          "https://campushunt.onrender.com/get_urls"
        );
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
    if (tab === "Log Out") {
      handleLogout();
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const deleteImage = async (url, public_id) => {
    try {
      const response = await axiosInstance.post(
        "https://campushunt.onrender.com/deleteImage",
        {
          data: { public_id },
        }
      );
      console.log("Delete response:", response.data);
      setImages(images.filter((image) => image.url !== url));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const editMeta = (public_id) => {
    setCurrentID(public_id);
    setShowModal(true);
  };

  const handleSaveMeta = async () => {
    const description = descriptionRef.current.value;
    const latitude = parseFloat(latitudeRef.current.value) || "";
    const longitude = parseFloat(longitudeRef.current.value) || "";

    try {
      await axiosInstance.post("https://campushunt.onrender.com/editImage", {
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

  const handleModalClose = () => setShowModal(false);

  return (
    <div className="screen">
      <div className="left">
        <NavBar onSelectTab={handleTabSelect} selectedTab={selectedTab} />
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
