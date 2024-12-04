import React, { useState } from "react";
import "./ColorSelect.css";

function ColorSelect( {label} ) {
	const [color, setColor] = useState('#ffffff');
	const handleChange = (event) => {
		setColor(event.target.value);
	};

	return (
	<>
		<div className="color-container-col">
			<input 
					type="color" 
					value={color} 
					onChange={handleChange}
			/>
			<p>{color}</p>
			<p>{label}</p>
		</div>
	</>
	);
}
  
  export default ColorSelect;