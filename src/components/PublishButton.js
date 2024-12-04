import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import "./PublishButton.css";

function PublishButton() {
	const [selectedButton, setSelectedButton] = useState("");

	const handleButtonClick = (buttonType) => {
		setSelectedButton(buttonType); // Set the selected button type (either "round" or "angled")
	};

	return (
		<>
			<Button
                className="publish-button"
				variant={selectedButton === "round" ? "primary" : "outline-primary"} // Highlight if selected
				onClick={() => handleButtonClick("round")}
			>
				Publish Changes
			</Button>{' '}
		</>
	);
}

export default PublishButton;
