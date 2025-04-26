import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllNeighbors, getAllUsers } from '../../../api/adminApiRequests';
import { RootState } from '../../../redux/store';
import { UserInfo } from '../../../types/settings';
import { format } from 'date-fns';

const NeighborList: React.FC = () => {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {  user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchUsers = async () => {
            if ( user?.type !== 'admin') {
                navigate('/admin');
                return;
            }
            try {
                const userList = await getAllNeighbors();
                setUsers(userList);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch users');
            }
        };
        fetchUsers();
    }, [ user, navigate]);

    // Add click handler function
    const handleUserClick = (user: UserInfo) => {
        // console.log(user)
        navigate('/admin/dashboard/users/details', { state: { user } });
    };
    const formatDOB = (dob: string | Date): string => {
        try {
          const date = typeof dob === 'string' ? new Date(dob) : dob;
          return format(date, 'MMMM d, yyyy');
        } catch {
          return typeof dob === 'string' ? dob : 'Invalid Date';
        }
      };

    return (
        <main className="flex-1 p-8">
            <h1 className="text-3xl font-semibold text-white mb-6">Neighbors List</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="bg-gray-950 rounded-lg shadow-xl p-6">
                {users.length === 0 ? (
                    <p className="text-gray-400">No neighbors found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Phone</th>
                                    <th className="py-3 px-4">Verification Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr 
                                        key={user.id}
                                        className="border-b border-gray-700 hover:bg-violet-900 cursor-pointer"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <td className="py-3 px-4">{user.name}</td>
                                        <td className="py-3 px-4">{user.email}</td>
                                        <td className="py-3 px-4">{user.phone}</td>
                                        <td className="py-3 px-4">{user.DOB ? formatDOB(user.DOB) : 'N/A'}</td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
};

export default NeighborList;