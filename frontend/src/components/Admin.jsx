import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Toaster, toast } from "sonner";
import {
  Trash2,
  Save,
  Moon,
  Sun,
  LogOut,
  UploadCloud,
  X,
  Menu,
  Image as ImageIcon,
} from "lucide-react";

import Modal from "./Modal"; // Import Modal
import SortablePhoto from "./SortablePhoto"; // Import SortablePhoto

import { defaultAvatar } from "../assets";

import imageCompression from "browser-image-compression";

const API_URL = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [error, setError] = useState("");
  const [heroText, setHeroText] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [orderChanged, setOrderChanged] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    onConfirm: () => {},
    title: "",
    message: "",
  });
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const authFetch = useCallback(
    (url, options = {}) => {
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
      return fetch(url, { ...options, headers });
    },
    [token]
  );

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/admins`);
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  }, [authFetch]);

  const [testimonials, setTestimonials] = useState(
    Array(3).fill({ name: "", text: "", image: "" })
  );
  const [testimonialFiles, setTestimonialFiles] = useState({});

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("adminTheme");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("adminTheme", JSON.stringify(dark));
  }, [dark]);

  const fetchPhotos = useCallback(() => {
    setLoading(true);
    authFetch(`${API_URL}/files`)
      .then((response) => response.json())
      .then((data) => {
        setPhotos(data);
      })
      .catch((err) => {
        setError("Failed to fetch photos. Is the backend server running?");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [authFetch]);

  const fetchContent = useCallback(() => {
    authFetch(`${API_URL}/content`)
      .then((res) => res.json())
      .then((data) => {
        setHeroText(data.heroText || "");
        setContactEmail(data.contactEmail || "");
        setContactNumber(data.contactNumber || "");
        setLinkedinLink(data.linkedinLink || "");
        setInstagramLink(data.instagramLink || "");
        setFacebookLink(data.facebookLink || "");
        const fetchedTestimonials = data.testimonials || [];
        const filledTestimonials = Array(3)
          .fill(null)
          .map(
            (_, i) =>
              fetchedTestimonials[i] || { name: "", text: "", image: "" }
          );
        setTestimonials(filledTestimonials);
      })
      .catch((err) => console.error("Failed to fetch site content:", err));
  }, [authFetch]);

  useEffect(() => {
    fetchAdmins();
    fetchPhotos();
    fetchContent();
  }, [fetchAdmins, fetchPhotos, fetchContent]);

  const handleAddAdmin = async () => {
    if (!newAdminEmail) {
      toast.error("Please enter an email address.");
      return;
    }

    const promise = authFetch(`${API_URL}/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newAdminEmail }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add admin.");
        }
        return res.json();
      })
      .then(() => {
        setNewAdminEmail("");
        fetchAdmins();
      });

    toast.promise(promise, {
      loading: "Adding new admin...",
      success: "Admin added successfully!",
      error: (err) => err.message,
    });
  };

  const handleRemoveAdmin = (id) => {
    // We can add a confirmation modal here for safety, but for now, we'll proceed directly.
    const promise = authFetch(`${API_URL}/admins/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to remove admin.");
      }
      fetchAdmins();
    });

    toast.promise(promise, {
      loading: "Removing admin...",
      success: "Admin removed successfully!",
      error: (err) => err.message, // Display specific error message on failure
    });
  };

  const handleContentUpdate = (key, value) => {
    const promise = authFetch(`${API_URL}/content`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to save.");
      return res.json();
    });

    toast.promise(promise, {
      loading: `Saving ${key.replace(/([A-Z])/g, " $1").toLowerCase()}...`,
      success: `${key.replace(/([A-Z])/g, " $1")} updated successfully!`,
      error: `Failed to update ${key}.`,
    });
  };

  const handleTestimonialFieldChange = (index, field, value) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value,
    };
    setTestimonials(updatedTestimonials);
  };

  const handleTestimonialImageChange = async (index, file) => {
    if (!file) return;

    const sizeLimit = 1024 * 1024; // 1MB

    if (file.size > sizeLimit) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        // Await the compression result directly
        const compressedFile = await imageCompression(file, options);
        setTestimonialFiles((prev) => ({ ...prev, [index]: compressedFile }));
      } catch (error) {
        console.error("Error compressing testimonial image:", error);
      }
    } else {
      // If the file is within the limit, use it directly
      setTestimonialFiles((prev) => ({ ...prev, [index]: file }));
    }
  };

  const handleSaveTestimonial = (index) => {
    const formData = new FormData();
    formData.append("name", testimonials[index].name);
    formData.append("text", testimonials[index].text);
    if (testimonialFiles[index]) {
      formData.append("image", testimonialFiles[index]);
    }
    // We send the index to identify which testimonial to update on the backend
    formData.append("index", index);

    const promise = authFetch(`${API_URL}/content/testimonial`, {
      method: "PUT",
      body: formData, // When using FormData, browser sets the Content-Type header automatically
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to save testimonial ${index + 1}.`);
        }
        return res.json();
      })
      .then((data) => {
        fetchContent(); // Re-fetch all content to get updated data
        setTestimonialFiles((prev) => ({ ...prev, [index]: null })); // Clear the staged file
        return data.message;
      });

    toast.promise(promise, {
      loading: `Saving testimonial ${index + 1}...`,
      success: (message) => message || `Testimonial ${index + 1} saved!`,
      error: (err) => err.message,
    });
  };

  const handleRemoveTestimonialImage = (index) => {
    const promise = authFetch(`${API_URL}/content/testimonial/${index}/image`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to remove image.");
        }
        return res.json();
      })
      .then(() => {
        fetchContent(); // Refresh the content to show the change
      });

    toast.promise(promise, {
      loading: "Removing image...",
      success: "Image removed successfully!",
      error: (err) => err.message,
    });
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFiles(null);
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const sizeLimit = 1024 * 1024; // 1MB

    try {
      // Create an array of promises, where each promise resolves to a file (either original or compressed)
      const processingPromises = Array.from(files).map((file) => {
        if (file.size > sizeLimit) {
          // If the file is too large, return the compression promise
          return imageCompression(file, options);
        }
        // Otherwise, return a promise that resolves immediately with the original file
        return Promise.resolve(file);
      });

      // Wait for all files to be processed
      const processedFiles = await Promise.all(processingPromises);
      setSelectedFiles(processedFiles);
    } catch (error) {
      console.error("Error processing gallery images:", error);
      toast.error("An error occurred while preparing your images.");
      setSelectedFiles(null); // Clear selection on error
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select one or more files to upload.");
      return;
    }

    const uploadPromises = Array.from(selectedFiles).map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return authFetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }
        return res.json();
      });
    });

    toast.promise(Promise.all(uploadPromises), {
      loading: "Uploading photos...",
      success: () => {
        fetchPhotos();
        setSelectedFiles(null);
        document.getElementById("file-input").value = null;
        return "All files uploaded successfully!";
      },
      error: (err) => {
        console.error("Failed to upload one or more photos:", err);
        return "Failed to upload one or more photos.";
      },
    });
  };

  const handleDeletePhoto = (filename) => {
    setModalState({
      isOpen: true,
      onConfirm: () => {
        const promise = authFetch(`${API_URL}/image/${filename}`, {
          method: "DELETE",
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to delete.");
          setPhotos(photos.filter((p) => p.filename !== filename));
        });

        toast.promise(promise, {
          loading: "Deleting photo...",
          success: "Photo deleted successfully!",
          error: "Failed to delete photo.",
        });
        setModalState({ isOpen: false });
      },
      title: "Delete Photo",
      message: "Are you sure you want to delete this photo?",
    });
  };

  const handleBulkDelete = () => {
    if (selectedPhotos.length === 0) {
      toast.error("Please select photos to delete.");
      return;
    }
    setModalState({
      isOpen: true,
      onConfirm: () => {
        const deletePromises = selectedPhotos.map((filename) =>
          authFetch(`${API_URL}/image/${filename}`, { method: "DELETE" })
        );

        toast.promise(Promise.all(deletePromises), {
          loading: `Deleting ${selectedPhotos.length} photos...`,
          success: (responses) => {
            if (responses.every((res) => res.ok)) {
              setPhotos(
                photos.filter((p) => !selectedPhotos.includes(p.filename))
              );
              setSelectedPhotos([]);
              return "Selected photos deleted successfully!";
            }
            throw new Error("Some photos could not be deleted.");
          },
          error: "Failed to delete photos.",
        });
        setModalState({ isOpen: false });
      },
      title: "Delete Selected Photos",
      message: `Are you sure you want to delete ${selectedPhotos.length} selected photos?`,
    });
  };

  const handleSaveOrder = () => {
    const orderedIds = photos.map((p) => p._id);
    const promise = authFetch(`${API_URL}/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to save order.");
      setOrderChanged(false);
    });

    toast.promise(promise, {
      loading: "Saving order...",
      success: "Order saved successfully!",
      error: "Failed to save order.",
    });
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        setOrderChanged(true);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePhotoSelection = (filename) => {
    setSelectedPhotos((prev) =>
      prev.includes(filename)
        ? prev.filter((name) => name !== filename)
        : [...prev, filename]
    );
  };

  const handleSelectAll = () => {
    setSelectedPhotos(
      selectedPhotos.length === photos.length
        ? []
        : photos.map((p) => p.filename)
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-stone-100 dark:bg-stone-900">
        <p className="text-center text-lg text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-stone-100 dark:bg-stone-900">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );

  const sidebarContent = (
    <div className="p-4 space-y-6">
      <div className="p-4 bg-white/10 dark:bg-neutral-800/50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3 text-white">Upload Photos</h2>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="file-input"
            className="w-full text-sm p-3 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-center bg-sky-500/10 text-sky-300 border-sky-400/50 hover:bg-sky-500/20"
          >
            <UploadCloud className="w-8 h-8 mb-2" />
            <span className="font-semibold">
              {selectedFiles
                ? `${selectedFiles.length} file(s) selected`
                : "Click to select files"}
            </span>
          </label>
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFiles}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <UploadCloud size={18} />
            Upload
          </button>
        </div>
      </div>
      <div className="p-4 bg-white/10 dark:bg-neutral-800/50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Manage Site Content
        </h2>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="heroText"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Hero Section Text
            </label>
            <textarea
              id="heroText"
              value={heroText}
              onChange={(e) => setHeroText(e.target.value)}
              maxLength="265"
              className="w-full p-2 border rounded-md bg-stone-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              rows="4"
            ></textarea>
            <div className="text-right text-sm text-gray-400 mt-1">
              {heroText.length} / 265
            </div>
            <button
              onClick={() => handleContentUpdate("heroText", heroText)}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Hero Text
            </button>
          </div>
          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Contact Email
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full p-2 border rounded-md bg-stone-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            />
            <button
              onClick={() => handleContentUpdate("contactEmail", contactEmail)}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Email
            </button>
          </div>
          <div>
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Contact Number
            </label>
            <input
              id="contactNumber"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full p-2 border rounded-md bg-stone-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            />
            <button
              onClick={() =>
                handleContentUpdate("contactNumber", contactNumber)
              }
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Number
            </button>
          </div>
          {/* Social Links */}
          <div>
            <label
              htmlFor="linkedinLink"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              LinkedIn Profile URL
            </label>
            <input
              id="linkedinLink"
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              value={linkedinLink}
              onChange={(e) => setLinkedinLink(e.target.value)}
              className="w-full p-2 border rounded-md bg-stone-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            />
            <button
              onClick={() => handleContentUpdate("linkedinLink", linkedinLink)}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save LinkedIn Link
            </button>
          </div>
          <div>
            <label
              htmlFor="instagramLink"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Instagram Profile URL
            </label>
            <input
              id="instagramLink"
              type="url"
              placeholder="https://instagram.com/your-profile"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              className="w-full p-2 border rounded-md bg-stone-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            />
            <button
              onClick={() =>
                handleContentUpdate("instagramLink", instagramLink)
              }
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Instagram Link
            </button>
          </div>
          <div>
            <label
              htmlFor="facebookLink"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Facebook Profile URL
            </label>
            <input
              id="facebookLink"
              type="url"
              placeholder="https://facebook.com/your-profile"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
              className="w-full p-2 border rounded-md bg-stone-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            />
            <button
              onClick={() => handleContentUpdate("facebookLink", facebookLink)}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Facebook Link
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="p-4 bg-white/10 dark:bg-neutral-800/50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Manage Testimonials
        </h2>
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="space-y-4 p-4 border border-neutral-700 rounded-lg"
            >
              <h3 className="font-semibold text-lg text-white">
                Testimonial {index + 1}
              </h3>

              {/* Name Input */}
              <div>
                <label
                  htmlFor={`testimonialName${index}`}
                  className="block text-sm font-medium mb-1 text-gray-300"
                >
                  Giver&apos;s Name
                </label>
                <input
                  id={`testimonialName${index}`}
                  type="text"
                  value={testimonial.name}
                  onChange={(e) =>
                    handleTestimonialFieldChange(index, "name", e.target.value)
                  }
                  className="w-full p-2 border rounded-md bg-stone-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
              </div>

              {/* Text Input */}
              <div>
                <label
                  htmlFor={`testimonialText${index}`}
                  className="block text-sm font-medium mb-1 text-gray-300"
                >
                  Testimonial Text
                </label>
                <textarea
                  id={`testimonialText${index}`}
                  value={testimonial.text}
                  onChange={(e) =>
                    handleTestimonialFieldChange(index, "text", e.target.value)
                  }
                  className="w-full p-2 border rounded-md bg-stone-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  rows="3"
                ></textarea>
              </div>

              {/* Image Input */}
              <div>
                <label
                  htmlFor={`testimonialImage${index}`}
                  className="block text-sm font-medium mb-1 text-gray-300"
                >
                  Giver&apos;s Image
                </label>
                <div className="flex items-center gap-4">
                  <img
                    // Use the testimonial image if it exists, otherwise fall back to the default avatar
                    src={testimonial.image || defaultAvatar}
                    alt="Current"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <label
                    htmlFor={`testimonialImage${index}`}
                    className="w-full text-sm p-2 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center text-center bg-sky-500/10 text-sky-300 border-sky-400/50 hover:bg-sky-500/20"
                  >
                    <ImageIcon size={18} className="mr-2" />
                    <span>
                      {testimonialFiles[index]
                        ? testimonialFiles[index].name
                        : "Change Image"}
                    </span>
                  </label>
                  <input
                    id={`testimonialImage${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleTestimonialImageChange(index, e.target.files[0])
                    }
                    className="hidden"
                  />
                </div>
              </div>

              {testimonial.image && (
                <button
                  onClick={() => handleRemoveTestimonialImage(index)}
                  className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white/90 p-2 rounded-lg transition-colors text-xs flex items-center justify-center gap-2"
                >
                  <X size={14} />
                  Remove Image
                </button>
              )}

              <button
                onClick={() => handleSaveTestimonial(index)}
                className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save Testimonial {index + 1}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white/10 dark:bg-neutral-800/50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Manage Admins</h2>
        <div className="space-y-4">
          {/* Add Admin Form */}
          <div>
            <label
              htmlFor="newAdminEmail"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Add New Admin
            </label>
            <div className="flex gap-2">
              <input
                id="newAdminEmail"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full p-2 border rounded-md bg-stone-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
              />
              <button
                onClick={handleAddAdmin}
                className="bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-600"
              >
                Add
              </button>
            </div>
          </div>
          {/* Admin List */}
          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-200">
              Current Admins
            </h3>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {admins.map((admin) => (
                <li
                  key={admin._id}
                  className="flex justify-between items-center p-2 bg-neutral-700/50 rounded-md text-sm"
                >
                  <span className="text-gray-300 truncate">{admin.email}</span>
                  <button
                    onClick={() => handleRemoveAdmin(admin._id)}
                    className="text-red-500 hover:text-red-400 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        theme={dark ? "dark" : "light"}
      />
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false })}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
      >
        <p>{modalState.message}</p>
      </Modal>

      <div className="bg-stone-100 dark:bg-stone-900 min-h-screen text-black dark:text-white">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 bg-stone-100/80 dark:bg-stone-900/80 backdrop-blur-sm z-30 flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 w-60 min-[320px]:w-72 md:w-80 lg:w-96 h-full bg-neutral-900/95 dark:bg-black/90 backdrop-blur-lg shadow-xl transform transition-transform md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-neutral-700/50">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <div className="h-[calc(100vh-140px)] overflow-y-auto">
            {sidebarContent}
          </div>
          <div className="absolute bottom-0 w-full p-4 border-t border-neutral-700/50 flex items-center justify-between">
            <button
              onClick={() => setDark(!dark)}
              className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-96 md:ml-80 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Manage Gallery</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Drag and drop to reorder, select to delete.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {orderChanged && (
                  <button
                    onClick={handleSaveOrder}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
                  >
                    <Save size={18} />
                    Save Order
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6 p-4 bg-white dark:bg-neutral-800/50 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={
                    photos.length > 0 && selectedPhotos.length === photos.length
                  }
                  onChange={handleSelectAll}
                  disabled={photos.length === 0}
                  className="h-5 w-5 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded text-sky-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="selectAll"
                  className="font-medium cursor-pointer"
                >
                  {selectedPhotos.length === photos.length
                    ? "Deselect All"
                    : "Select All"}
                </label>
              </div>
              {selectedPhotos.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
                >
                  <Trash2 size={18} />
                  Delete Selected ({selectedPhotos.length})
                </button>
              )}
            </div>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={photos.map((p) => p._id)}
                strategy={rectSortingStrategy}
              >
                <div className="h-6 pb-10 flex justify-end pr-24">
                  <p>Total Photos = {photos.length}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-24">
                  {photos.map((photo) => (
                    <SortablePhoto
                      key={photo._id}
                      photo={{ ...photo, onDelete: handleDeletePhoto }}
                      isSelected={selectedPhotos.includes(photo.filename)}
                      onSelectionChange={handlePhotoSelection}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </main>
      </div>
    </>
  );
};

export default Admin;
