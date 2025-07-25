import { useState, useEffect } from "react";

const Admin = () => {
  const [photos, setPhotos] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPhotos = () => {
    fetch("http://localhost:5000/api/photos")
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

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim() === "") {
      alert("Photo URL cannot be empty.");
      return;
    }
    fetch("http://localhost:5000/api/photos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: newPhotoUrl }),
    })
      .then((res) => res.json())
      .then((newPhoto) => {
        setPhotos([...photos, newPhoto]);
        setNewPhotoUrl("");
      })
      .catch((err) => console.error("Failed to add photo:", err));
  };

  const handleDeletePhoto = (id) => {
    fetch(`http://localhost:5000/api/photos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setPhotos(photos.filter((photo) => photo.id !== id));
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
          <h2 className="text-xl font-semibold mb-2">Add New Photo</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="Enter photo URL (e.g., /src/assets/showcase/new_image.jpg)"
              className="border p-2 rounded-md w-full dark:bg-neutral-700 dark:border-neutral-600"
            />
            <button
              onClick={handleAddPhoto}
              className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-md transition-colors"
            >
              Add Photo
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={`Photo ${photo.id}`}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
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
