import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import "./ButtonSelector.css";

function ButtonSelector() {
	const [selectedButton, setSelectedButton] = useState("");

	const handleButtonClick = (buttonType) => {
		setSelectedButton(buttonType); // Set the selected button type (either "round" or "angled")
	};

	return (
		<>
			<Button
				className="round-button"
				variant={selectedButton === "round" ? "primary" : "outline-primary"} // Highlight if selected
				onClick={() => handleButtonClick("round")}
			>
				Round
			</Button>{' '}

			<Button
				className="angled-button"
				variant={selectedButton === "angled" ? "primary" : "outline-primary"} // Highlight if selected
				onClick={() => handleButtonClick("angled")}
			>
				Angled
			</Button>{' '}
		</>
	);
}

export default ButtonSelector;
