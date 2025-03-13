// // src/pages/admin/Dashboard.tsx
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { getAllUsers } from '../../api/adminApiRequests';
// import { RootState } from '../../redux/store';
// import { UserInfo } from '../../types/settings';

// // interface UserInfo {
// //   id: string;
// //   name: string;
// //   email: string;
// //   phone: string;
// //   address: object;
// //   isVerified: boolean;
// //   createdAt: string;
// //   updatedAt: string;
// //   govtId: string;
// //   role: 'user';
// //   profilePicUrl?: string;
// // }

// const AdminDashboard = () => {
//     const [users, setUsers] = useState<UserInfo[]>([]);
//     const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { accessToken, user } = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       if (!accessToken || user?.role !== 'admin') {
//         navigate('/admin/login');
//         return;
//       }
//       try {
//           const userList = await getAllUsers();
          
//         setUsers(userList );
//       } catch (err: any) {
//         setError(err.message || 'Failed to fetch users');
//       }
//     };
//     fetchUsers();
//   }, [accessToken, user, navigate]);

//   const handleLogout = () => {
//     // Add logout action later
//     navigate('/admin/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white p-6 flex-shrink-0">
//         <div className="text-2xl font-bold mb-8">Neighborly</div>
//         <nav>
//           <ul className="space-y-4">
//             <li>
//               <button className="w-full text-left py-2 px-4 bg-indigo-600 rounded-md">Users</button>
//             </li>
//             {/* Add more nav items later */}
//             <li>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md transition duration-200"
//               >
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8">
//         <h1 className="text-3xl font-semibold text-white mb-6">Admin Dashboard</h1>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <div className="bg-gray-800 rounded-lg shadow-xl p-6">
//           <h2 className="text-xl font-semibold text-white mb-4">User List</h2>
//           {users.length === 0 ? (
//             <p className="text-gray-400">No users found.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-gray-300">
//                 <thead>
//                   <tr className="border-b border-gray-700">
//                     <th className="py-3 px-4">Name</th>
//                     <th className="py-3 px-4">Email</th>
//                     <th className="py-3 px-4">Phone</th>
//                     <th className="py-3 px-4">ID number</th>
//                     <th className="py-3 px-4">Verified</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user) => (
//                     <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700" >
//                       <td className="py-3 px-4">{user.name}</td>
//                       <td className="py-3 px-4">{user.email}</td>
//                       <td className="py-3 px-4">{user.phone}</td>
//                       <td className="py-3 px-4">{user.govtId}</td>
//                       <td className="py-3 px-4">
//                         {user.isVerified ? (
//                           <span className="text-green-500">Yes</span>
//                         ) : (
//                           <span className="text-red-500">No</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;