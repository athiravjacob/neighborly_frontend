import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllNeighbors } from '../../../api/adminApiRequests';
import { RootState } from '../../../redux/store';
import { format } from 'date-fns';
import { NeighborInfo } from '../../../types/neighbor';

const NeighborList: React.FC = () => {
    const [users, setUsers] = useState<NeighborInfo[]>([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchUsers = async () => {
            if (user?.type !== 'admin') {
                navigate('/admin');
                return;
            }
            
            setIsLoading(true);
            try {
                const neighborList = await getAllNeighbors();
                setUsers(neighborList);
                setError('');
            } catch (err: any) {
                setError(err.message || 'Failed to fetch users');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUsers();
    }, [user, navigate]);

    const handleUserClick = (user: NeighborInfo) => {
        navigate('/admin/dashboard/neighbors/details', { state: { user } });
    };

    const formatDOB = (dob: string | Date): string => {
        try {
            const date = typeof dob === 'string' ? new Date(dob) : dob;
            return format(date, 'MMMM d, yyyy');
        } catch {
            return typeof dob === 'string' ? dob : 'Invalid Date';
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
    );

    return (
        <main className="flex-1 p-6 md:p-8 bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Neighbors Management</h1>
                        <p className="text-gray-400 text-sm md:text-base">{users.length} total neighbors registered</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 relative">
                        <input
                            type="text"
                            placeholder="Search neighbors..."
                            className="bg-gray-800 text-gray-200 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gray-850 bg-opacity-50 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-white">Neighbor Directory</h2>
                        <div className="text-gray-400 text-sm">
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'result' : 'results'}
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="py-16 px-6 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-1">No neighbors found</h3>
                            <p className="text-gray-400">There are no registered neighbors in the system.</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-16 px-6 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-1">No matching results</h3>
                            <p className="text-gray-400">Try adjusting your search to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-300">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-4 px-6 font-medium">Name</th>
                                        <th className="py-4 px-6 font-medium">Email</th>
                                        <th className="py-4 px-6 font-medium">Phone</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="border-b border-gray-700 hover:bg-violet-900 hover:bg-opacity-25 transition-colors duration-150 cursor-pointer"
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <td className="py-4 px-6 flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-medium mr-3">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-200">{user.name}</span>
                                            </td>
                                            <td className="py-4 px-6">{user.email}</td>
                                            <td className="py-4 px-6">{user.phone || "—"}</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    user.isVerified 
                                                        ? "bg-green-900 bg-opacity-40 text-green-400" 
                                                        : "bg-yellow-900 bg-opacity-40 text-yellow-400"
                                                }`}>
                                                    {user.isVerified ? "Verified" : "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Table Footer */}
                    {users.length > 0 && (
                        <div className="px-6 py-4 bg-gray-850 bg-opacity-30 border-t border-gray-700 text-gray-400 text-sm flex justify-between items-center">
                            <div>
                                Showing {filteredUsers.length} of {users.length} neighbors
                            </div>
                            <div className="flex items-center">
                                <button className="text-gray-400 hover:text-white mr-4">
                                    Export List
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default NeighborList;