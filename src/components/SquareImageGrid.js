import React from 'react';
import './SquareImageGrid.css';
import FileUpload from './FileUpload';

const SquareImageGrid = ({ images }) => {
    
    return (
        <div className="image-grid">
            <FileUpload />
            {images.map((image, index) => (
                <div className="image-box" key={index}>
                    <img src={image.src} alt={image.alt} className="image" />
                </div>
            ))}
        </div>
    );
};

export default SquareImageGrid;
