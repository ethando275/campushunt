import Form from 'react-bootstrap/Form';
import React, { useState } from "react";

function LogoUpload() {
	// const [logo, setLogo] = useState("")
	const [preview, setPreview] = useState(null);

	const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file from input
    if (file) {
      // setLogo(file); // Set the file in state
      setPreview(URL.createObjectURL(file)); // Create a URL to preview the image
    }
  };

	// const handleSubmit = (event) => {
  //   event.preventDefault(); // Prevent page reload
  //   if (logo) {
  //     console.log('Uploading:', logo); // You can handle the file upload logic here
  //   } else {
  //     alert('No file selected.');
  //   }
  // };

  return (
    <>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Logo</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>

			{preview && (
        <div className="mb-3">
          <img src={preview} alt="Preview" style={{ maxWidth: '200px', height: 'auto' }} />
        </div>
      )}

    </>
  );
}

export default LogoUpload;