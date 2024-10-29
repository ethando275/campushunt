import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './FileUpload.css';

const FileUpload = () => {
    const [show, setShow] = useState(false);
    const [files, setFiles] = useState([]);
    const [captions, setCaptions] = useState({});

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

    const handleCaptionChange = (index, value) => {
        setCaptions({ ...captions, [index]: value });
    };

    const handleUpload = () => {
        alert("Files and captions submitted!");
        handleClose(); // Close the modal and reset states
    };

    return (
        <>
            <Button variant="secondary" onClick={handleShow} className="file-upload-button">
                <img className="" src="https://img.icons8.com/ios/50/000000/upload-to-cloud.png" alt="Upload" />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Your Files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="drag-drop-zone" onClick={() => document.getElementById('fileInput').click()}>
                        Click to upload individual files
                    </div>
                    <input
                        type="file"
                        id="fileInput"
                        multiple
                        accept="image/*"
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                    />

                    <div className="drag-drop-zone" onClick={() => document.getElementById('folderInput').click()}>
                        Click to upload a folder
                    </div>
                    <input
                        type="file"
                        id="folderInput"
                        multiple
                        webkitdirectory="true"
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                    />

                    <ul className="file-list mt-3">
                        {files.map((fileObj, index) => (
                            <li key={index} className="d-flex align-items-center mb-3">
                                <img
                                    src={fileObj.preview}
                                    alt="Preview"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter caption"
                                    value={captions[index] || ''}
                                    onChange={(e) => handleCaptionChange(index, e.target.value)}
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
                    <Button variant="primary" onClick={handleUpload}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FileUpload;
