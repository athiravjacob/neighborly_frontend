// src/components/common/Card.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  to: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  icon: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ to, imageSrc, imageAlt, title, icon, className }) => (
  <Link
    to={to}
    className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 ${className}`}
  >
    <div className="relative h-48">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover rounded-t-xl"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <span className="text-white text-lg font-semibold">Book Now</span>
      </div>
    </div>
    <div className="p-6 flex items-center gap-4">
      {icon}
      <h3 className="text-xl font-semibold text-violet-900">{title}</h3>
    </div>
  </Link>
);

export default Card;