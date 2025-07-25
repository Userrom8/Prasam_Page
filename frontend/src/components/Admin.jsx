import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPhotos = () => {
    setLoading(true);
    fetch(`${API_URL}/files`)
      .then((response) => response.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch photos. Is the backend server running?");
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((newPhotoData) => {
        const newPhoto = {
          _id: newPhotoData.file.id,
          filename: newPhotoData.file.filename,
        };
        setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
        setSelectedFile(null);
        document.getElementById("file-input").value = null;
      })
      .catch((err) => console.error("Failed to upload photo:", err));
  };

  const handleDeletePhoto = (filename) => {
    fetch(`${API_URL}/image/${filename}`, {
      // Corrected URL
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Filter out the deleted photo by filename
          setPhotos(photos.filter((photo) => photo.filename !== filename));
        } else {
          alert("Failed to delete photo.");
        }
      })
      .catch((err) => console.error("Failed to delete photo:", err));
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="dark:bg-stone-900 bg-stone-100 min-h-screen text-black dark:text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin - Manage Photos
        </h1>
        <div className="mb-8 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Upload New Photo</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded-md w-full dark:bg-neutral-700 dark:border-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />
            <button
              onClick={handleUpload}
              className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-md transition-colors"
            >
              Upload Photo
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div key={photo._id} className="relative group">
              <img
                src={`${API_URL}/image/${photo.filename}`}
                alt={photo.filename}
                className="w-full h-auto rounded-lg shadow-lg aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeletePhoto(photo.filename)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-full"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
