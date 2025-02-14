import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserCircle, LogOut, Plus, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/index';
import { toast } from 'react-hot-toast';
import carImage from '../assets/car1.svg'; // Import the vector image (adjust path as needed)

const DashBoard = () => {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const fetchedCars = await api.getCars(token);
        if (fetchedCars.success) {
          setCars(fetchedCars.cars);
        }
      } catch (error) {
        toast.error('Error fetching cars:', error.message);
      }
    };

    fetchCars();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filtering based on carName, modelName, buyDate, and buyPrice
  const filteredCars = cars.filter(car =>
    car.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.buyDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.buyPrice.toString().includes(searchQuery) ||
    car.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-300">
      {/* Navigation Bar */}
      <nav className="bg-pink-300 shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white-900">
                <span className="text-white-900">Own-</span>CarShowroom
              </h1>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                <UserCircle className="h-8 w-8 text-white-900" />
                <div className="text-sm text-right">
                  <p className="text-white-500 truncate max-w-[150px]">{user?.username}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-white-500" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 break-all">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12" onClick={() => setShowUserMenu(false)}>
        {/* About the Website Section */}
        <div className=" p-6 mb-8 flex items-center justify-between">
          {/* Left Side - Text Heading and Subheading */}
          <div className="max-w-xl">
            <h3 className="text-4xl font-bold text-gray-900">Welcome to Own-CarShowroom!</h3>
            <p className="text-gray-600 mt-4 text-2xl">
              This platform helps you manage your car collection easily. You can track all your vehicles, add new cars to your collection, and manage important information like car name, model, purchase date, price, and more.
            </p>
            <p className="text-gray-500 mt-4 text-md text-xl">
              Start by adding your first car, or search through your collection to see all the cars you've added so far.
            </p>
          </div>

          {/* Right Side - Car Vector Image */}
          <div className="hidden md:block w-1/3">
            <img
              src={carImage} // Use imported image here
              alt="Car Vector"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Search Bar & Add New Car Button */}
        <div className="relative mb-8">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by car name, model, price, etc..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Add New Car Button */}
            <Link
              to="/car/new"
              className="inline-flex items-center justify-center bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Car</span>
            </Link>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map(car => (
            <Link
              key={car._id}
              to={`/car/${car._id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={car.images[0]}
                  alt={car.carName}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition duration-200">
                  {car.carName} ({car.modelName})
                </h3>
                <p className="text-gray-600 line-clamp-2 mb-4">{car.description}</p>
                <div className="flex flex-wrap gap-2">
                  {car.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-gray-600 text-sm">Price: Rs: {car.buyPrice}</p>
                <p className="text-gray-500 text-xs mt-1">Purchased on: {new Date(car.buyDate).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}

          {/* Empty State */}
          {filteredCars.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first car'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
