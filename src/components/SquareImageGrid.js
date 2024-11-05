import React from "react";
import "./SquareImageGrid.css";
import FileUpload from "./FileUpload";

const SquareImageGrid = ({ images, onDelete, onImageClick }) => {
  const handleDelete = (url, public_id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      onDelete(url, public_id);
    }
  };

  return (
    <div className="image-grid">
      <FileUpload />
      {images.map((image, index) => (
        <div
          className="image-box"
          key={index}
          onClick={() => onImageClick(image.public_id)}
        >
          <button
            className="delete-button"
            onClick={() => handleDelete(image.url, image.public_id)}
          >
            X
          </button>
          <img src={image.url} alt={`Uploaded ${index}`} className="image" />
        </div>
      ))}
    </div>
  );
};

export default SquareImageGrid;
