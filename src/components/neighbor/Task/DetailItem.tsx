import React from 'react';

interface DetailItemProps {
  label: string;
  value: string;
}

export const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div className="group">
    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</dt>
    <dd className="text-gray-900 font-medium">{value}</dd>
  </div>
);