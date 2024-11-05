import React, { useState } from "react";

function ColorSelect( {label} ) {
	const [color, setColor] = useState('#ffffff');
	const handleChange = (event) => {
		setColor(event.target.value);
	};

	return (
	<>
		<input 
				type="color" 
				value={color} 
				onChange={handleChange}
		/>
		<p>{color}</p>
		<p>{label}</p>
	</>
	);
}
  
  export default ColorSelect;