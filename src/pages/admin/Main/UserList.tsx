import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllUsers } from '../../../api/adminApiRequests';
import { RootState } from '../../../redux/store';
import { userGeneralInfo } from '../../../types/UserDTO';
import DataTable from '../../../components/common/DataTable';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<userGeneralInfo[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<userGeneralInfo[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
        const userList = await getAllUsers();
        setUsers(userList);
        setFilteredUsers(userList);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [user, navigate]);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, users]);

  const handleUserClick = (user: userGeneralInfo) => {
    navigate('/admin/dashboard/users/details', { state: { user } });
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (user: userGeneralInfo) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-medium mr-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-200">{user.name}</span>
        </div>
      ),
    },
    { key: 'email', header: 'Email', render: (user: userGeneralInfo) => user.email },
    {
      key: 'phone',
      header: 'Phone',
      render: (user: userGeneralInfo) => user.phone || '—',
    },
    {
      key: 'status',
      header: 'User Status',
      render: (user: userGeneralInfo) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.isBanned
              ? 'bg-red-900 bg-opacity-40 text-red-400'
              : 'bg-green-900 bg-opacity-40 text-green-400'
          }`}
        >
          {user.isBanned ? 'Banned' : 'Active'}
        </span>
      ),
    },
  ];

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DataTable
      data={paginatedUsers}
      columns={columns}
      isLoading={isLoading}
      error={error}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      onRowClick={handleUserClick}
      totalItems={filteredUsers.length}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
};

export default UserList;