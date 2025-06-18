// import React, { useState, useCallback, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { LocationPicker } from '../../common/LocationPicker';
// import { ListAvailableNeighbors } from '../../../api/neighborApiRequests';
// import { fetchCategory, fetchSubcategory } from '../../../api/taskApiRequests';
// import { NeighborInfo } from '../../../types/neighbor';
// import { category, subCategory } from '../../../types/category';

// interface DescribeTaskProps {
//   onContinue: (data: {
//     lat: number;
//     lng: number;
//     address: string;
//     taskSize: string;
//     taskDetails: string;
//     category: string;
//     subCategory: string;
//     neighbors: NeighborInfo[];
//   }) => void;
// }

// export const DescribeTask: React.FC<DescribeTaskProps> = ({ onContinue }) => {
//   const [address, setAddress] = useState('');
//   const [lat, setLat] = useState<number | null>(null);
//   const [lng, setLng] = useState<number | null>(null);
//   const [taskSize, setTaskSize] = useState('');
//   const [taskDetails, setTaskDetails] = useState('');
//   const [category, setCategory] = useState('');
//   const [subcategory, setSubcategory] = useState('');
//   const [showValidation, setShowValidation] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [neighbors, setNeighbors] = useState<NeighborInfo[]>([]);
//   const [isServiceAvailable, setIsServiceAvailable] = useState<boolean | null>(null);
//   const [categories, setCategories] = useState<category[]>([]);
//   const [subcategories, setSubcategories] = useState<subCategory[]>([]);
//   const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
//   const [isSubcategoriesLoading, setIsSubcategoriesLoading] = useState(false);

//   // Fetch categories on component mount
//   useEffect(() => {
//     const loadCategories = async () => {
//       setIsCategoriesLoading(true);
//       try {
//         const categoryList = await fetchCategory();
//         console.log('fetchCategory response:', categoryList); // Debug log
//         if (!Array.isArray(categoryList)) {
//           console.error('fetchCategory did not return an array:', categoryList);
//           setCategories([]);
//           toast.error('Failed to load categories: Invalid data format.');
//           return;
//         }
//         setCategories(categoryList);
//       } catch (error: any) {
//         console.error('Error fetching categories:', error);
//         setCategories([]);
//         toast.error(error.message || 'Failed to fetch categories.');
//       } finally {
//         setIsCategoriesLoading(false);
//       }
//     };
//     loadCategories();
//   }, []);

//   // Fetch subcategories when category changes
//   useEffect(() => {
//     if (!category) {
//       setSubcategories([]);
//       setSubcategory('');
//       setTaskSize(''); // Reset taskSize when category changes
//       setNeighbors([]);
//       setIsServiceAvailable(null);
//       return;
//     }

//     const loadSubcategories = async () => {
//       setIsSubcategoriesLoading(true);
//       try {
//         const selectedCategory = categories.find((cat) => cat.category === category);
//         if (selectedCategory) {
//           const subcategoryList = await fetchSubcategory(selectedCategory._id);
//           console.log('fetchSubcategory response:', subcategoryList); // Debug log
//           if (!Array.isArray(subcategoryList)) {
//             console.error('fetchSubcategory did not return an array:', subcategoryList);
//             setSubcategories([]);
//             toast.error('Failed to load subcategories: Invalid data format.');
//             return;
//           }
//           setSubcategories(subcategoryList);
//         } else {
//           setSubcategories([]);
//         }
//       } catch (error: any) {
//         console.error('Error fetching subcategories:', error);
//         setSubcategories([]);
//         toast.error(error.message || 'Failed to fetch subcategories.');
//       } finally {
//         setIsSubcategoriesLoading(false);
//       }
//     };
//     loadSubcategories();
//   }, [category, categories]);

//   const handleCheckAvailability = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!lat || !lng) {
//         toast.info('Please select a location on the map.');
//         setShowValidation(true);
//         return;
//       }
//       if (!subcategory) {
//         toast.info('Please select a subcategory.');
//         setShowValidation(true);
//         return;
//       }
//       setIsLoading(true);
//       try {
//         const neighborsList = await ListAvailableNeighbors(lng, lat, subcategory);
//         setNeighbors(neighborsList);
//         setIsServiceAvailable(neighborsList.length > 0);
//         setShowValidation(false);
//       } catch (error: any) {
//         toast.error(error.message || 'Failed to check availability.');
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [lat, lng, subcategory]
//   );

//   const handleContinue = useCallback(() => {
//     setShowValidation(true);
//     if (isServiceAvailable === null) {
//       toast.error('Please check service availability for your location.');
//       return;
//     }
//     if (!isServiceAvailable) {
//       toast.error('Sorry, service is not available in your location yet.');
//       return;
//     }
//     if (!taskSize) {
//       toast.error('Please select a subcategory to set task size.');
//       return;
//     }
//     if (!taskDetails) {
//       toast.error('Please provide task details.');
//       return;
//     }
//     if (!category) {
//       toast.error('Please select a category.');
//       return;
//     }
//     if (!subcategory) {
//       toast.error('Please select a subcategory.');
//       return;
//     }
   
//     if (!lat || !lng) {
//       toast.error('Please select a location.');
//       return;
//     }
//     onContinue({
//       lat,
//       lng,
//       address,
//       taskSize,
//       taskDetails,
//       category,
//       subCategory: subcategory,
//       neighbors,
//     });
//   }, [lat, lng, address, taskSize, taskDetails, category, subcategory, neighbors, isServiceAvailable]);

//   // Get the selected subcategory's duration
//   const selectedSubcategory = subcategories.find((sub) => sub.subCategory === subcategory);
//   const durationMessage = selectedSubcategory
//     ? `The selected task usually takes ${selectedSubcategory.minDuration} - ${selectedSubcategory.maxDuration} hours.`
//     : '';

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
//       <div className="p-6">
//         <p className="opacity-90 bg-gray-100 p-4 rounded-lg text-gray-700">
//           Tell us about your task. We use these details to show Taskers in your area who fit your needs.
//         </p>
//       </div>

//       <div className="p-6 space-y-6">
//         <div>
//           <label className="block text-gray-700 font-medium mb-2" htmlFor="location-input">
//             Where do you need help?
//           </label>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <input
//               id="location-input"
//               type="text"
//               value={address}
//               readOnly
//               placeholder="Select a location on the map"
//               className={`flex-1 px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 ${
//                 showValidation && !address ? 'border-red-600' : 'border-gray-300'
//               } focus:outline-none focus:ring-2 focus:ring-violet-600`}
//               aria-label="Selected task location"
//             />
//           </div>
//           <LocationPicker
//             height="16rem"
//             initialCoordinates={{ lat: 40.7128, lng: -74.006 }}
//             onLocationChange={(data) => {
//               setAddress(data.address);
//               setLat(data.coordinates.lat);
//               setLng(data.coordinates.lng);
//             }}
//             showRadius={false}
//             showAddressInput={false}
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium mb-2" htmlFor="category-select">
//             Select Task Category
//           </label>
//           <select
//             id="category-select"
//             value={category}
//             onChange={(e) => {
//               setCategory(e.target.value);
//               setSubcategory('');
//               setTaskSize(''); // Reset taskSize when category changes
//               setNeighbors([]);
//               setIsServiceAvailable(null);
//             }}
//             disabled={isCategoriesLoading}
//             className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 ${
//               showValidation && !category ? 'border-red-600' : 'border-gray-300'
//             } ${isCategoriesLoading ? 'bg-gray-100' : ''}`}
//             aria-label="Task category"
//           >
//             <option value="">{isCategoriesLoading ? 'Loading categories...' : 'Select a category'}</option>
//             {Array.isArray(categories) && categories.length > 0 ? (
//               categories.map((cat) => (
//                 <option key={cat._id} value={cat.category}>
//                   {cat.category}
//                 </option>
//               ))
//             ) : (
//               <option value="" disabled>
//                 No categories available
//               </option>
//             )}
//           </select>
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium mb-2" htmlFor="subcategory-select">
//             Select Task Subcategory
//           </label>
//           <select
//             id="subcategory-select"
//             value={subcategory}
//             onChange={(e) => {
//               const newSubcategory = e.target.value;
//               setSubcategory(newSubcategory);
//               const selectedSub = subcategories.find((sub) => sub.subCategory === newSubcategory);
//               if (selectedSub) {
//                 setTaskSize(`${selectedSub.minDuration}-${selectedSub.maxDuration}hr`);
//               } else {
//                 setTaskSize('');
//               }
//               setNeighbors([]);
//               setIsServiceAvailable(null);
//             }}
//             disabled={!category || isSubcategoriesLoading}
//             className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 disabled:bg-gray-100 ${
//               showValidation && !subcategory && category ? 'border-red-600' : 'border-gray-300'
//             }`}
//             aria-label="Task subcategory"
//           >
//             <option value="">{isSubcategoriesLoading ? 'Loading subcategories...' : 'Select a subcategory'}</option>
//             {Array.isArray(subcategories) && subcategories.length > 0 ? (
//               subcategories.map((sub) => (
//                 <option key={sub._id} value={sub.subCategory}>
//                   {sub.subCategory} (Est. {sub.minDuration}-{sub.maxDuration}hr)
//                 </option>
//               ))
//             ) : (
//               <option value="" disabled>
//                 No subcategories available
//               </option>
//             )}
//           </select>
//         </div>

        

//         <div className="flex flex-col gap-2">
//           <button
//             onClick={handleCheckAvailability}
//             className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={isLoading || !lat || !lng || !subcategory}
//             aria-label="Check service availability"
//           >
//             {isLoading ? 'Checking...' : 'Check Availability'}
//           </button>
//           {isServiceAvailable === false && (
//             <p className="text-red-600">No neighbors available in this location for the selected subcategory.</p>
//           )}
//           {isServiceAvailable === true && (
//             <p className="text-green-600">
//               Service available at {address}! {neighbors.length} neighbors found.
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium mb-2" htmlFor="task-details">
//             Tell us the details of your task
//           </label>
//           {durationMessage && (
//             <p className="text-gray-700 mb-2">
//               {durationMessage}{' '}
//               <span className="text-gray-500">
//                 The final duration will be confirmed by the helper after reviewing your task description. Please provide detailed and accurate information to ensure an appropriate match.
//               </span>
//             </p>
//           )}
          
//           <textarea
//             id="task-details"
//             value={taskDetails}
//             onChange={(e) => setTaskDetails(e.target.value)}
//             placeholder="Provide a summary of what you need done for your Tasker. Be sure to include details like the size of your space, any equipment/tools needed, and how to get in."
//             className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 h-32 ${
//               showValidation && !taskDetails ? 'border-red-600' : 'border-gray-300'
//             }`}
//             aria-label="Task details"
//           />
//         </div>

//         <div className="flex justify-center sm:justify-end mt-6">
//           <button
//             onClick={handleContinue}
//             className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium"
//             aria-label="Continue to see helpers and prices"
//             disabled={isLoading || isCategoriesLoading || isSubcategoriesLoading}
//           >
//             See Helpers and Prices
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { LocationPicker } from '../../common/LocationPicker';
import { ListAvailableNeighbors } from '../../../api/neighborApiRequests';
import { fetchCategory, fetchSubcategory } from '../../../api/taskApiRequests';
import { NeighborInfo } from '../../../types/neighbor';
import { category, subCategory } from '../../../types/category';

interface DescribeTaskProps {
  onContinue: (data: {
    lat: number;
    lng: number;
    address: string;
    taskSize: string;
    taskDetails: string;
    category: string;
    subCategory: string;
    neighbors: NeighborInfo[];
  }) => void;
}

export const DescribeTask: React.FC<DescribeTaskProps> = ({ onContinue }) => {
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [taskSize, setTaskSize] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [neighbors, setNeighbors] = useState<NeighborInfo[]>([]);
  const [isServiceAvailable, setIsServiceAvailable] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<category[]>([]);
  const [subcategories, setSubcategories] = useState<subCategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSubcategoriesLoading, setIsSubcategoriesLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const categoryList = await fetchCategory();
        console.log('fetchCategory response:', categoryList);
        if (!Array.isArray(categoryList)) {
          console.error('fetchCategory did not return an array:', categoryList);
          setCategories([]);
          toast.error('Failed to load categories: Invalid data format.');
          return;
        }
        setCategories(categoryList);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        setCategories([]);
        toast.error(error.message || 'Failed to fetch categories.');
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!category) {
      setSubcategories([]);
      setSubcategory('');
      setTaskSize('');
      setNeighbors([]);
      setIsServiceAvailable(null);
      return;
    }

    const loadSubcategories = async () => {
      setIsSubcategoriesLoading(true);
      try {
        const selectedCategory = categories.find((cat) => cat.category === category);
        if (selectedCategory) {
          const subcategoryList = await fetchSubcategory(selectedCategory._id);
          console.log('fetchSubcategory response:', subcategoryList);
          if (!Array.isArray(subcategoryList)) {
            console.error('fetchSubcategory did not return an array:', subcategoryList);
            setSubcategories([]);
            toast.error('Failed to load subcategories: Invalid data format.');
            return;
          }
          setSubcategories(subcategoryList);
        } else {
          setSubcategories([]);
        }
      } catch (error: any) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
        toast.error(error.message || 'Failed to fetch subcategories.');
      } finally {
        setIsSubcategoriesLoading(false);
      }
    };
    loadSubcategories();
  }, [category, categories]);

  const handleCheckAvailability = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!lat || !lng) {
        toast.info('Please select a location on the map.');
        setShowValidation(true);
        return;
      }
      if (!subcategory) {
        toast.info('Please select a subcategory.');
        setShowValidation(true);
        return;
      }
      setIsLoading(true);
      try {
        const neighborsList = await ListAvailableNeighbors(lng, lat, subcategory);
        setNeighbors(neighborsList);
        setIsServiceAvailable(neighborsList.length > 0);
        setShowValidation(false);
      } catch (error: any) {
        toast.error(error.message || 'Failed to check availability.');
      } finally {
        setIsLoading(false);
      }
    },
    [lat, lng, subcategory]
  );

  const handleContinue = useCallback(() => {
    setShowValidation(true);
    if (isServiceAvailable === null) {
      toast.error('Please check service availability for your location.');
      return;
    }
    if (!isServiceAvailable) {
      toast.error('Sorry, service is not available in your location yet.');
      return;
    }
    if (!taskSize) {
      toast.error('Please select a subcategory to set task size.');
      return;
    }
    if (!taskDetails) {
      toast.error('Please provide task details.');
      return;
    }
    if (!category) {
      toast.error('Please select a category.');
      return;
    }
    if (!subcategory) {
      toast.error('Please select a subcategory.');
      return;
    }
    if (!lat || !lng) {
      toast.error('Please select a location.');
      return;
    }
    onContinue({
      lat,
      lng,
      address,
      taskSize,
      taskDetails,
      category,
      subCategory: subcategory,
      neighbors,
    });
  }, [lat, lng, address, taskSize, taskDetails, category, subcategory, neighbors, isServiceAvailable]);

  // Get the selected subcategory's duration
  const selectedSubcategory = subcategories.find((sub) => sub.subCategory === subcategory);
  const durationMessage = selectedSubcategory
    ? `The selected task usually takes ${selectedSubcategory.minDuration} - ${selectedSubcategory.maxDuration} hours.`
    : '';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-6">
        <p className="opacity-90 bg-gray-100 p-4 rounded-lg text-gray-700">
          Tell us about your task. We use these details to show Taskers in your area who fit your needs.
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="location-input">
            Where do you need help?
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="location-input"
              type="text"
              value={address}
              readOnly
              placeholder="Select a location on the map"
              className={`flex-1 px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 ${
                showValidation && !address ? 'border-red-600' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-violet-600`}
              aria-label="Selected task location"
            />
          </div>
          <LocationPicker
            height="16rem"
            initialCoordinates={{ lat: 40.7128, lng: -74.006 }}
            onLocationChange={(data) => {
              setAddress(data.address);
              setLat(data.coordinates.lat);
              setLng(data.coordinates.lng);
            }}
            showRadius={false}
            showAddressInput={false}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="category-select">
            Select Task Category
          </label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory('');
              setTaskSize('');
              setNeighbors([]);
              setIsServiceAvailable(null);
            }}
            disabled={isCategoriesLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 ${
              showValidation && !category ? 'border-red-600' : 'border-gray-300'
            } ${isCategoriesLoading ? 'bg-gray-100' : ''}`}
            aria-label="Task category"
          >
            <option value="">{isCategoriesLoading ? 'Loading categories...' : 'Select a category'}</option>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat._id} value={cat.category}>
                  {cat.category}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No categories available
              </option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="subcategory-select">
            Select Task Subcategory
          </label>
          <select
            id="subcategory-select"
            value={subcategory}
            onChange={(e) => {
              const newSubcategory = e.target.value;
              setSubcategory(newSubcategory);
              const selectedSub = subcategories.find((sub) => sub.subCategory === newSubcategory);
              if (selectedSub) {
                setTaskSize(`${selectedSub.minDuration}-${selectedSub.maxDuration}hr`);
              } else {
                setTaskSize('');
              }
              setNeighbors([]);
              setIsServiceAvailable(null);
            }}
            disabled={!category || isSubcategoriesLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 disabled:bg-gray-100 ${
              showValidation && !subcategory && category ? 'border-red-600' : 'border-gray-300'
            }`}
            aria-label="Task subcategory"
          >
            <option value="">{isSubcategoriesLoading ? 'Loading subcategories...' : 'Select a subcategory'}</option>
            {Array.isArray(subcategories) && subcategories.length > 0 ? (
              subcategories.map((sub) => (
                <option key={sub._id} value={sub.subCategory}>
                  {sub.subCategory} (Est. {sub.minDuration}-{sub.maxDuration}hr)
                </option>
              ))
            ) : (
              <option value="" disabled>
                No subcategories available
              </option>
            )}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCheckAvailability}
            className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !lat || !lng || !subcategory}
            aria-label="Check service availability"
          >
            {isLoading ? 'Checking...' : 'Check Availability'}
          </button>
          {isServiceAvailable === false && (
            <p className="text-red-600">No neighbors available in this location for the selected subcategory.</p>
          )}
          {isServiceAvailable === true && (
            <p className="text-green-600">
              Service available at {address}! {neighbors.length} neighbors found.
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="task-details">
            Tell us the details of your task
          </label>
          {durationMessage && (
            <p className="text-gray-700 mb-2">
              {durationMessage}{' '}
              <span className="text-gray-500">
                The final duration will be confirmed by the helper after reviewing your task description. Please provide detailed and accurate information to ensure an appropriate match.
              </span>
            </p>
          )}
          <textarea
            id="task-details"
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
            placeholder="Provide a summary of what you need done for your Tasker. Be sure to include details like the size of your space, any equipment/tools needed, and how to get in."
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 h-32 ${
              showValidation && !taskDetails ? 'border-red-600' : 'border-gray-300'
            }`}
            aria-label="Task details"
          />
        </div>

        <div className="flex justify-center sm:justify-end mt-6">
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium"
            aria-label="Continue to see helpers and prices"
            disabled={isLoading || isCategoriesLoading || isSubcategoriesLoading}
          >
            See Helpers and Prices
          </button>
        </div>
      </div>
    </div>
  );
};