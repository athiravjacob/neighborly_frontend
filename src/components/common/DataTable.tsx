import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  error: string;
  searchTerm: string;
  onSearch: (term: string) => void;
  onRowClick: (item: T) => void;
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const DataTable = <T,>({
  data,
  columns,
  isLoading,
  error,
  searchTerm,
  onSearch,
  onRowClick,
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}: DataTableProps<T>) => {
  return (
    <main className="flex-1 p-6 md:p-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Data Management</h1>
            <p className="text-gray-400 text-sm md:text-base">{totalItems} total items</p>
          </div>
          <div className="mt-4 md:mt-0 relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-800 text-gray-200 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full md:w-64"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gray-850 bg-opacity-50 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Data Directory</h2>
            <div className="text-gray-400 text-sm">
              {data.length} {data.length === 1 ? 'result' : 'results'}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-1">No data found</h3>
              <p className="text-gray-400">There are no items in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700">
                    {columns.map((column) => (
                      <th key={column.key} className="py-4 px-6 font-medium">
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-violet-900 hover:bg-opacity-25 transition-colors duration-150 cursor-pointer"
                      onClick={() => onRowClick(item)}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="py-4 px-6">
                          {column.render(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data.length > 0 && (
            <div className="px-6 py-4 bg-gray-850 bg-opacity-30 border-t border-gray-700 text-gray-400 text-sm flex justify-between items-center">
              <div>
                Showing {data.length} of {totalItems} items
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-violet-600 hover:text-white disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
                </span>
                <button
                  className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-violet-600 hover:text-white disabled:opacity-50"
                  disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DataTable;