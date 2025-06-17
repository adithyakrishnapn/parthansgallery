import React, { useState } from 'react';
import axios from 'axios';

// Import the component's specific CSS
import './MultipleImageUploader.css';

const MultipleImageUploader = ({ onUpload, folderName }) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const handleFileSelect = (e) => {
        // Convert FileList to an array to make it easier to work with
        const selectedFiles = Array.from(e.target.files);
        setImages(selectedFiles);
    };

    const handleMultipleUpload = async () => {
        if (images.length === 0) return;

        setUploading(true);
        setUploadProgress(0);
        const uploadedImagesData = [];

        try {
            // Loop through each selected file and upload it
            for (let i = 0; i < images.length; i++) {
                const formData = new FormData();
                formData.append("file", images[i]);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
                formData.append("folder", folderName);

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                    formData
                );
                
                uploadedImagesData.push(response.data);
                // Update the progress bar after each successful upload
                setUploadProgress(((i + 1) / images.length) * 100);
            }

            // After all uploads are complete, call the onUpload callback with the results
            onUpload(uploadedImagesData);

        } catch (error) {
            console.error("Multiple upload failed:", error);
            alert("Some images failed to upload. Please check the console for details.");
        } finally {
            // Reset the state regardless of success or failure
            setUploading(false);
            setUploadProgress(0);
            setImages([]);
            
            // It's tricky to programmatically clear the file input, this is a common workaround
            const fileInput = document.getElementById(`multiple-uploader-${folderName}`);
            if (fileInput) fileInput.value = "";
        }
    };

    return (
        <div className="multiple-image-uploader">
            <input 
                id={`multiple-uploader-${folderName}`} // Unique ID to help with resetting
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileSelect} 
            />
            
            {images.length > 0 && (
                <div className="selected-images-info">
                    <p>{images.length} image(s) selected for upload</p>
                    <div className="image-preview">
                        {images.slice(0, 5).map((image, index) => (
                            <span key={index} className="image-name" title={image.name}>
                                {image.name}
                            </span>
                        ))}
                        {images.length > 5 && (
                             <span className="image-name more-count">
                                +{images.length - 5} more
                             </span>
                        )}
                    </div>
                </div>
            )}

            <button 
                onClick={handleMultipleUpload} 
                disabled={images.length === 0 || uploading}
                className="upload-multiple-btn"
            >
                {uploading 
                    ? `Uploading... ${Math.round(uploadProgress)}%` 
                    : `Upload ${images.length} Image(s)`}
            </button>

            {uploading && (
                <div className="upload-progress">
                    <div 
                        className="progress-bar" 
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default MultipleImageUploader;