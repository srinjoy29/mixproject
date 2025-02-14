import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../api/index";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null); // For managing zoom

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        if (!token) {
          toast.error("Unauthorized! Please log in.");
          navigate("/login");
          return;
        }
        const fetchedCar = await api.getCar(id, token);
        if (!fetchedCar.success) {
          toast.error(fetchedCar.message);
          navigate("/dashboard");
          return;
        }
        setCar(fetchedCar.car);
      } catch (error) {
        console.error("Failed to fetch car details:", error);
        toast.error("Failed to load car details. Please try again.");
        navigate("/dashboard");
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        if (!token) {
          toast.error("Unauthorized! Please log in.");
          navigate("/login");
          return;
        }
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await api.deleteCar(id, token, userId);
        if (response.error) {
          toast.error(response.error);
          return;
        }
        toast.success("Car deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to delete car:", error);
        toast.error("Failed to delete car. Please try again.");
      }
    }
  };

  const handleImageClick = (src) => {
    setZoomedImage(src); // Open the zoomed image
  };

  const closeZoom = () => {
    setZoomedImage(null); // Close the zoomed image
  };

  if (!car) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            Back to Dashboard
          </button>
          <div className="flex-1" />
          <button
            onClick={() => navigate(`/car/edit/${id}`, { state: { car } })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {car.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Car image ${index + 1}`}
                className="cursor-pointer object-cover w-full h-full rounded-md shadow-md transition-transform duration-200 hover:scale-105"
                onClick={() => handleImageClick(src)}
              />
            ))}
          </div>

          {/* Zoomed Image Modal */}
          {zoomedImage && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={closeZoom}
            >
              <div
                className="relative max-w-4xl w-full p-4"
                onClick={(e) => e.stopPropagation()} // Prevent closing on image click
              >
                <img
                  src={zoomedImage}
                  alt="Zoomed"
                  className="w-full h-auto object-contain rounded-md"
                />
                <button
                  onClick={closeZoom}
                  className="absolute top-4 right-4 text-white bg-black/60 rounded-full p-2 hover:bg-black/80"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Car Details */}
          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {car.carName} - {car.modelName}
            </h1>
            <h2 className="text-2xl text-gray-600 mb-6">
              <strong>Buy Date:</strong> {car.buyDate}
            </h2>
            <h2 className="text-2xl text-gray-600 mb-6">
              <strong>Buy Price:</strong> ₹{car.buyPrice}
            </h2>
            <p className="text-xl text-gray-600 mb-6 whitespace-pre-wrap">
              <strong>Description:</strong> {car.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {car.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
