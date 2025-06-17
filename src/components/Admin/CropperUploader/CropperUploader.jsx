import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';

// Import the CSS for the cropper library
import 'react-image-crop/dist/ReactCrop.css';

// It's good practice to have the component's specific CSS alongside it
import './CropperUploader.css'; 

// Helper function to get the cropped image blob
function getCroppedImg(image, crop) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
    );
    
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg', 0.95); // High quality JPEG
    });
}


const CropperUploader = ({ onUpload, folderName, aspect = 16 / 9 }) => {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const imgRef = useRef(null);

    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Makes crop preview update between images
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
            setIsModalOpen(true);
            e.target.value = null; // Allows selecting the same file again
        }
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
            width,
            height
        );
        setCrop(newCrop);
    };

    const handleCropAndUpload = async () => {
        if (!imgRef.current || !crop || !crop.width || !crop.height) {
            alert("Please select a crop area.");
            return;
        }

        setUploading(true);
        const croppedImageBlob = await getCropperdImg(imgRef.current, crop);
        
        const formData = new FormData();
        formData.append('file', croppedImageBlob, 'cropped-image.jpeg');
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', folderName);

        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
            onUpload(response.data); // Pass the Cloudinary response up
            setIsModalOpen(false); // Close modal on success
        } catch (error) {
            console.error("Cloudinary upload failed:", error);
            alert("Upload failed. See console for details.");
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div className="cropper-uploader-container">
            <input type="file" accept="image/*" onChange={onFileChange} />
            {isModalOpen && (
                <div className="cropper-modal-overlay">
                    <div className="cropper-modal-content">
                        <h3>Crop Your Image (16:9 Aspect Ratio)</h3>
                        {imgSrc && (
                            <div className="crop-preview-wrapper">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    aspect={aspect}
                                    className="react-cropper"
                                >
                                    <img ref={imgRef} alt="Crop preview" src={imgSrc} onLoad={onImageLoad} />
                                </ReactCrop>
                            </div>
                        )}
                        <div className="cropper-modal-actions">
                            <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                            <button onClick={handleCropAndUpload} disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Crop & Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropperUploader;