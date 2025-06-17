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
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseconfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

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
    formData.append("folder", folderName); // Organize in Cloudinary

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      onUpload(response.data); // Pass the full Cloudinary response back
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
        setSelectedCategoryId(cats[0].id); // Default to first category
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
      // Cleanup listeners on unmount
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

  // Portfolio Handlers
  const handlePortfolioUpload = async (cloudinaryResponse) => {
    if (!portfolioTitle || !selectedCategoryId) {
      alert("Please enter a title and select a category.");
      return;
    }
    const selectedCategory = categories.find(
      (c) => c.id === selectedCategoryId
    );
    await addDoc(collection(db, "portfolio"), {
      title: portfolioTitle,
      categoryId: selectedCategoryId,
      categoryName: selectedCategory.name, // Denormalize for easier display
      imageUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id, // For potential future deletion
      createdAt: new Date(),
    });
    setPortfolioTitle("");
  };
  const handleDeletePortfolioItem = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this portfolio item?")
    ) {
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

  // --- HANDLERS for Featured Slider Images ---
  const handleFeaturedUpload = async (cloudinaryResponse) => {
    if (featuredImages.length >= 5) {
      alert(
        "You can only have a maximum of 5 featured images. Please delete one before adding another."
      );
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
            <h3>Upload New Portfolio Item</h3>
            <div className="form-section">
              <input
                type="text"
                placeholder="Item Title"
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
              />
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ImageUploader
                onUpload={handlePortfolioUpload}
                folderName="portfolio"
              />
            </div>
            <h3>Existing Portfolio Items</h3>
            <div className="items-grid">
              {portfolioItems.map((item) => (
                <div key={item.id} className="item-card">
                  <img src={item.imageUrl} alt={item.title} />
                  <p>{item.title}</p>
                  <span>{item.categoryName}</span>
                  <button
                    onClick={() => handleDeletePortfolioItem(item.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
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
              These are the images that appear in the large slider at the top of
              your full portfolio page.
            </p>

            {featuredImages.length < 5 ? (
              <div className="form-section">
                <ImageUploader
                  onUpload={handleFeaturedUpload}
                  folderName="featured"
                  className="featured-uploader"
                />
              </div>
            ) : (
              <p className="limit-reached-message">
                You have reached the 5 image limit. Delete an image to add a new
                one.
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
          {/* ADD THIS NEW BUTTON */}
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
