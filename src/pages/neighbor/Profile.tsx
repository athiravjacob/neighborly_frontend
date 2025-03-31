// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Define User interface
// interface User {
//   name: string;
//   email: string;
//   phone: string;
//   profilePicture: string;
//   idStatus: 'pending' | 'approved' | 'rejected';
//   ratings?: { average: number; count: number }; // Optional ratings
// }

// const NeighborProfile = () => {
//   const navigate = useNavigate();

//   // Mock user state (replace with real API data)
//   const [user, setUser] = useState<User>({
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '+1 (555) 123-4567',
//     profilePicture: '', // Default empty, updated via Cloudinary
//     idStatus: 'pending', // Can be 'pending', 'approved', or 'rejected'
//     ratings: { average: 4.8, count: 28 }, // Optional, can be undefined
//   });

//   const [profilePic, setProfilePic] = useState<string | null>(user.profilePicture);
//   const [isEditingPicture, setIsEditingPicture] = useState(false);

//   // Load Cloudinary script
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
//     script.async = true;
//     document.body.appendChild(script);
//     return () => document.body.removeChild(script);
//   }, []);

//   // Handle profile picture upload with Cloudinary
//   const handleProfilePicUpload = () => {
//     // window.cloudinary.openUploadWidget(
//     //   {
//     //     cloudName: 'your-cloud-name', // Replace with your Cloudinary cloud name
//     //     uploadPreset: 'your-upload-preset', // Replace with your preset
//     //     sources: ['local', 'camera'],
//     //     multiple: false,
//     //     resourceType: 'image',
//     //     cropping: true, // Optional: enable cropping for profile pics
//     //     croppingAspectRatio: 1, // Square crop
//     //   },
//     //   (error: any, result: any) => {
//     //     if (!error && result && result.event === 'success') {
//     //       const url = result.info.secure_url;
//     //       setProfilePic(url);
//     //       setUser((prev) => ({ ...prev, profilePicture: url }));
//     //       setIsEditingPicture(false);
//     //       // Submit to backend: POST /profile-picture with { userId, url }
//     //       console.log('Profile picture uploaded:', url);
//     //     }
//     //   }
//     // );
//   };

//   // Handle ID re-upload if rejected
//   const handleIdReUpload = () => {
//     // window.cloudinary.openUploadWidget(
//     //   {
//     //     cloudName: 'your-cloud-name',
//     //     uploadPreset: 'your-upload-preset',
//     //     sources: ['local', 'camera'],
//     //     multiple: false,
//     //     resourceType: 'image',
//     //   },
//     //   (error: any, result: any) => {
//     //     if (!error && result && result.event === 'success') {
//     //       const url = result.info.secure_url;
//     //       // Submit to backend: POST /id-upload with { userId, idUrl }
//     //       console.log('ID re-uploaded:', url);
//     //       setUser((prev) => ({ ...prev, idStatus: 'pending' })); // Reset to pending
//     //     }
//     //   }
//     // );
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg mx-auto mt-10">
//       <h2 className="text-xl font-bold text-violet-950 mb-6">Your Profile</h2>

//       {/* Profile Picture */}
//       <div className="flex items-center space-x-6 mb-6">
//         <div className="relative">
//           <img
//             src={
//               profilePic || 'https://via.placeholder.com/150' // Fallback if no picture
//             }
//             alt="Profile"
//             className="w-32 h-32 rounded-full object-cover"
//           />
//           <button
//             onClick={() => setIsEditingPicture(true)}
//             className="absolute bottom-0 right-0 bg-violet-950 text-white rounded-full p-2 hover:bg-violet-800"
//           >
//             ✎
//           </button>
//         </div>
//         {isEditingPicture && (
//           <div className="flex flex-col space-y-2">
//             <button
//               onClick={handleProfilePicUpload}
//               className="px-4 py-2 bg-violet-950 text-white rounded-lg hover:bg-violet-800"
//             >
//               Upload New Picture
//             </button>
//             <button
//               onClick={() => setIsEditingPicture(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>

//       {/* User Details */}
//       <div className="space-y-4 mb-6">
//         <div>
//           <strong className="text-gray-700">Name:</strong> {user.name}
//         </div>
//         <div>
//           <strong className="text-gray-700">Email:</strong> {user.email}
//         </div>
//         <div>
//           <strong className="text-gray-700">Phone:</strong> {user.phone}
//         </div>
//         <div>
//           <strong className="text-gray-700">ID Status:</strong>{' '}
//           {user.idStatus === 'approved' && (
//             <span className="text-green-600">Verified ✓</span>
//           )}
//           {user.idStatus === 'pending' && (
//             <span className="text-yellow-600">Pending Approval</span>
//           )}
//           {user.idStatus === 'rejected' && (
//             <div className="flex items-center space-x-2">
//               <span className="text-red-600">Rejected</span>
//               <button
//                 onClick={handleIdReUpload}
//                 className="px-3 py-1 bg-violet-950 text-white rounded-lg text-sm hover:bg-violet-800"
//               >
//                 Upload Again
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Ratings */}
//         {user.ratings && (
//           <div>
//             <strong className="text-gray-700">Ratings:</strong>{' '}
//             <span className="text-violet-800 font-semibold">
//               {user.ratings.average.toFixed(1)} / 5
//             </span>{' '}
//             ({user.ratings.count} reviews)
//             <div className="flex mt-1">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <svg
//                   key={star}
//                   className={`h-5 w-5 ${
//                     star <= Math.floor(user.ratings!.average)
//                       ? 'text-violet-500'
//                       : 'text-gray-200'
//                   }`}
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Edit Button */}
//       <button
//         onClick={() => navigate('/settings')}
//         className="w-full px-4 py-2 bg-violet-950 text-white rounded-lg hover:bg-violet-800"
//       >
//         Edit Profile
//       </button>
//     </div>
//   );
// };

// export default NeighborProfile;