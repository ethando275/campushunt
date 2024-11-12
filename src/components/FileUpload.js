import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance"; // Import the Axios instance
import "./FileUpload.css";

const FileUpload = () => {
  const [show, setShow] = useState(false);
  const [files, setFiles] = useState([]);
  const [captions, setCaptions] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setFiles([]);
    setCaptions({});
  };

  const handleInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleCaptionChange = (index, field, value) => {
    const parsedValue =
      field === "latitude" || field === "longitude" ? parseFloat(value) : value;
    setCaptions({
      ...captions,
      [index]: {
        ...captions[index],
        [field]: parsedValue,
      },
    });
  };

  const handleUpload = async () => {
    setUploading(true);

    const formData = new FormData();

    files.forEach((fileObj, index) => {
      formData.append("files", fileObj.file);
      formData.append(
        `captions[${index}][description]`,
        captions[index]?.description || ""
      );
      formData.append(
        `captions[${index}][latitude]`,
        captions[index]?.latitude || ""
      );
      formData.append(
        `captions[${index}][longitude]`,
        captions[index]?.longitude || ""
      );
    });

    try {
      const response = await axiosInstance.post(
        "https://campushunt.onrender.com/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Files uploaded successfully!");
      console.log("Upload response:", response.data);
      setFiles([]);
      setCaptions({});
      setShow(false); // Close the modal on success
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Please check the console for more details.");
    } finally {
      setUploading(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleShow}
        className="file-upload-button"
      >
        <img
          className=""
          src="https://img.icons8.com/ios/50/000000/upload-to-cloud.png"
          alt="Upload"
        />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Your Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="drag-drop-zone"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Click to upload individual files
          </div>
          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />

          <div
            className="drag-drop-zone"
            onClick={() => document.getElementById("folderInput").click()}
          >
            Click to upload a folder
          </div>
          <input
            type="file"
            id="folderInput"
            multiple
            webkitdirectory="true"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />

          <ul className="file-list mt-3">
            {files.map((fileObj, index) => (
              <li
                key={index}
                className="d-flex flex-column align-items-start mb-3"
              >
                <img
                  src={fileObj.preview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
                <input
                  type="text"
                  placeholder="Enter description"
                  value={captions[index]?.description || ""}
                  onChange={(e) =>
                    handleCaptionChange(index, "description", e.target.value)
                  }
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  placeholder="Enter latitude"
                  value={captions[index]?.latitude || ""}
                  onChange={(e) =>
                    handleCaptionChange(index, "latitude", e.target.value)
                  }
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  placeholder="Enter longitude"
                  value={captions[index]?.longitude || ""}
                  onChange={(e) =>
                    handleCaptionChange(index, "longitude", e.target.value)
                  }
                  className="form-control"
                />
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FileUpload;
