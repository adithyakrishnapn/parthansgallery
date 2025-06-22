import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  deleteDoc,
  setDoc,
  writeBatch
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseconfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import CropperUploader from "../../components/Admin/CropperUploader/CropperUploader";
import MultipleImageUploader from "../../components/Admin/MultipleImageUploader/MultipleImageUploader";

// --- Reusable Image Upload Component ---
const ImageUploader = ({ onUpload, folderName }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleUpload = async () => {
    if (!image) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folderName);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      onUpload(response.data);
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
    } finally {
      setUploading(false);
      setImage(null);
    }
  };

  return (
    <div className="image-uploader">
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload} disabled={!image || uploading}>
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

// --- Main Dashboard Component ---
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  const navigate = useNavigate();

  // State for Portfolio Management
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [featuredImages, setFeaturedImages] = useState([]);
  const [useAutoTitles, setUseAutoTitles] = useState(true);

  // State for Category Management
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  // State for Site Content (Lander & Profile Images)
  const [landerImage, setLanderImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // --- Data Fetching using useEffect ---
  useEffect(() => {
    // Listener for Portfolio Items
    const portfolioQuery = query(
      collection(db, "portfolio"),
      orderBy("createdAt", "desc")
    );
    const unsubPortfolio = onSnapshot(portfolioQuery, (snapshot) => {
      setPortfolioItems(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    // Listener for Categories
    const categoryQuery = query(collection(db, "categories"), orderBy("name"));
    const unsubCategories = onSnapshot(categoryQuery, (snapshot) => {
      const cats = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setCategories(cats);
      if (cats.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(cats[0].id);
      }
    });

    // Listener for Site Content
    const unsubLander = onSnapshot(
      doc(db, "siteContent", "landerImage"),
      (doc) => {
        setLanderImage(doc.exists() ? doc.data() : null);
      }
    );
    const unsubProfile = onSnapshot(
      doc(db, "siteContent", "profileImage"),
      (doc) => {
        setProfileImage(doc.exists() ? doc.data() : null);
      }
    );

    const featuredQuery = query(
      collection(db, "featuredImages"),
      orderBy("createdAt", "asc")
    );
    const unsubFeatured = onSnapshot(featuredQuery, (snapshot) => {
      setFeaturedImages(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    return () => {
      unsubPortfolio();
      unsubCategories();
      unsubLander();
      unsubProfile();
      unsubFeatured();
    };
  }, [selectedCategoryId]);

  // --- Handler Functions ---
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  // Category Handlers
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await addDoc(collection(db, "categories"), {
      name: newCategoryName.trim(),
    });
    setNewCategoryName("");
  };
  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Are you sure? Deleting a category will not delete its portfolio items."
      )
    ) {
      await deleteDoc(doc(db, "categories", id));
    }
  };

  // Portfolio Handlers - Updated for multiple images
      const handleMultiplePortfolioUpload = async (cloudinaryResponses) => {
        if (!selectedCategoryId) {
            alert("Please select a category.");
            return;
        }

        const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

        try {
            // Create a new batch instance
            const batch = writeBatch(db);

            cloudinaryResponses.forEach((response, index) => {
                // Create a reference for a new, empty document in the 'portfolio' collection
                const newDocRef = doc(collection(db, "portfolio"));

                // Determine the title for the image
                const title = useAutoTitles
                    ? `${selectedCategory.name} - Image ${portfolioItems.length + index + 1}`
                    : portfolioTitle || `${selectedCategory.name} - Image ${portfolioItems.length + index + 1}`;
                
                // Set the data for the new document within the batch
                batch.set(newDocRef, {
                    title: title,
                    categoryId: selectedCategoryId,
                    categoryName: selectedCategory.name,
                    imageUrl: response.secure_url,
                    publicId: response.public_id,
                    createdAt: new Date(),
                });
            });

            // Commit the batch to Firestore. This performs all writes in one operation.
            await batch.commit();

            // Reset form and give feedback
            setPortfolioTitle("");
            alert(`Successfully uploaded and saved ${cloudinaryResponses.length} images!`);

        } catch (error) {
            console.error("Error saving portfolio items in batch:", error);
            alert("Error saving portfolio items. Please check the console for details.");
        }
    };

  // Single image upload handler
  const handlePortfolioUpload = async (cloudinaryResponse) => {
    if (!selectedCategoryId) {
      alert("Please select a category.");
      return;
    }

    const selectedCategory = categories.find(
      (c) => c.id === selectedCategoryId
    );

    const title = useAutoTitles
      ? `${selectedCategory.name} - Image ${portfolioItems.length + 1}`
      : portfolioTitle || `${selectedCategory.name} - Image ${portfolioItems.length + 1}`;

    await addDoc(collection(db, "portfolio"), {
      title: title,
      categoryId: selectedCategoryId,
      categoryName: selectedCategory.name,
      imageUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      createdAt: new Date(),
    });
    setPortfolioTitle("");
  };

  const handleDeletePortfolioItem = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this portfolio item?")
    ) {
      // Note: This only deletes the Firestore record.
      // You might want to also delete the image from Cloudinary here.
      await deleteDoc(doc(db, "portfolio", id));
    }
  };

  // Site Content Handlers
  const handleLanderUpload = async (cloudinaryResponse) => {
    await setDoc(doc(db, "siteContent", "landerImage"), {
      imageUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
    });
  };
  const handleDeleteLander = async () => {
    if (window.confirm("Are you sure?"))
      await deleteDoc(doc(db, "siteContent", "landerImage"));
  };
  const handleProfileUpload = async (cloudinaryResponse) => {
    await setDoc(doc(db, "siteContent", "profileImage"), {
      imageUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
    });
  };
  const handleDeleteProfile = async () => {
    if (window.confirm("Are you sure?"))
      await deleteDoc(doc(db, "siteContent", "profileImage"));
  };

  // Featured Slider Images Handlers
  const handleFeaturedUpload = async (cloudinaryResponse) => {
    if (featuredImages.length >= 5) {
      alert("You can only have a maximum of 5 featured images.");
      return;
    }
    await addDoc(collection(db, "featuredImages"), {
      imageUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      createdAt: new Date(),
    });
  };

  const handleDeleteFeaturedImage = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this featured image?")
    ) {
      await deleteDoc(doc(db, "featuredImages", id));
    }
  };

  // --- Render Logic ---
  const renderContent = () => {
    switch (activeTab) {
      case "portfolio":
        return (
          <div className="tab-content">
            <h3>Upload Portfolio Items</h3>
            <div className="form-section column-layout">
              {" "}
              {/* Added a helper class for styling */}
              <div className="category-selection">
                <label>Select Category:</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Choose a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="title-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={useAutoTitles}
                    onChange={(e) => setUseAutoTitles(e.target.checked)}
                  />
                  Use automatic numbering for titles
                </label>
              </div>
              {!useAutoTitles && (
                <div className="manual-title">
                  <input
                    type="text"
                    placeholder="Custom base title for all images"
                    value={portfolioTitle}
                    onChange={(e) => setPortfolioTitle(e.target.value)}
                  />
                </div>
              )}
              {/* --- USE THE NEW COMPONENT HERE --- */}
              <MultipleImageUploader
                onUpload={handleMultiplePortfolioUpload}
                folderName="portfolio"
              />
            </div>

            <hr/>

            <h3>Existing Portfolio Items ({portfolioItems.length})</h3>
            {/* --- FIX STARTS HERE --- */}
            <div className="items-grid">
              {portfolioItems.map((item) => (
                <div key={item.id} className="item-card">
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="item-card-info">
                    <p>{item.title}</p>
                    <small>Category: {item.categoryName}</small>
                  </div>
                  <button
                    onClick={() => handleDeletePortfolioItem(item.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            {/* --- FIX ENDS HERE --- */}
          </div>
        );
      case "categories":
        return (
          <div className="tab-content">
            <h3>Create New Category</h3>
            <div className="form-section">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button onClick={handleAddCategory}>Add Category</button>
            </div>
            <h3>Existing Categories</h3>
            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat.id}>
                  {cat.name}
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="delete-btn-small"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      case "siteImages":
        return (
          <div className="tab-content">
            <h3>Lander Page Image</h3>
            <div className="site-image-manager">
              {landerImage ? (
                <div className="item-card">
                  <img src={landerImage.imageUrl} alt="Lander" />
                  <button onClick={handleDeleteLander} className="delete-btn">
                    Delete Lander Image
                  </button>
                </div>
              ) : (
                <ImageUploader
                  onUpload={handleLanderUpload}
                  folderName="site"
                />
              )}
            </div>
            <hr />
            <h3>Portfolio Self (Profile) Image</h3>
            <div className="site-image-manager">
              {profileImage ? (
                <div className="item-card">
                  <img src={profileImage.imageUrl} alt="Profile" />
                  <button onClick={handleDeleteProfile} className="delete-btn">
                    Delete Profile Image
                  </button>
                </div>
              ) : (
                <ImageUploader
                  onUpload={handleProfileUpload}
                  folderName="site"
                />
              )}
            </div>
          </div>
        );
      case "featured":
        return (
          <div className="tab-content">
            <h3>Manage Featured Slider Images (Max 5)</h3>
            <p>
              Upload images for the top slider. You will be asked to crop them
              to a 16:9 aspect ratio.
            </p>

            {featuredImages.length < 5 ? (
              <div className="form-section">
                {/* Use the new CropperUploader component here */}
                <CropperUploader
                  onUpload={handleFeaturedUpload}
                  folderName="featured"
                />
              </div>
            ) : (
              <p className="limit-reached-message">
                You have reached the 5 image limit.
              </p>
            )}

            <h3>Current Featured Images</h3>
            <div className="items-grid">
              {featuredImages.map((item) => (
                <div key={item.id} className="item-card">
                  <img src={item.imageUrl} alt="Featured" />
                  <button
                    onClick={() => handleDeleteFeaturedImage(item.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
        <div className="dashboard-nav">
          <button
            onClick={() => setActiveTab("featured")}
            className={activeTab === "featured" ? "active" : ""}
          >
            Featured Slider
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={activeTab === "portfolio" ? "active" : ""}
          >
            Portfolio Items
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={activeTab === "categories" ? "active" : ""}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("siteImages")}
            className={activeTab === "siteImages" ? "active" : ""}
          >
            Site Images
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;