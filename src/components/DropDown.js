import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';

function DropDown() {
    const[font, setFont] =  useState("Arial");

    const fonts = [
        "Arial",
        "Verdana",
        "Tahoma",
        "Trebuchet MS",
        "Times New Roman",
        "Georgia",
        "Garamond",
        "Courier New",
        "Brush Script MT"
    ]

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {font}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
        {fonts.map((font) => (
            <p
            key={font}
            onClick={() => setFont(font)}
            >
            {font}
            </p>
        ))}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

}

export default DropDown;