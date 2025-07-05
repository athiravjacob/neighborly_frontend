import React from 'react';

interface TopItem {
  [key: string]: string | number;
}

interface TopItemsProps {
  title: string;
  items: TopItem[];
  fields: { key: string; label: string }[];
}

const TopItems: React.FC<TopItemsProps> = ({ title, items, fields }) => {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {fields.map((field) => (
                  <th
                    key={field.key}
                    className="py-3 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {fields.map((field) => (
                    <td
                      key={field.key}
                      className="py-3 px-6 text-sm text-gray-900 dark:text-gray-200"
                    >
                      {field.key === 'earnings' ? `₹${item[field.key]}` : item[field.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopItems;