
import React from 'react';
import { ArchivedCardData } from '../types';

interface CardProps {
  item: ArchivedCardData;
}

const Card: React.FC<CardProps> = ({ item }) => {
  const typeStyles = {
    note: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    image: 'bg-blue-100 text-blue-800 border-blue-300',
    pdf: 'bg-red-100 text-red-800 border-red-300',
  };
  
  return (
    <div className="bg-brand-white border border-brand-gray-dark rounded-medium p-5 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-text/30">
      <div>
        <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg text-brand-text pr-2">{item.title}</h3>
            <span className={`text-xs font-bold uppercase px-2 py-1 border rounded-soft ${typeStyles[item.type]}`}>
                {item.type}
            </span>
        </div>
        <p className="text-sm text-brand-text-light line-clamp-4">{item.summary}</p>
      </div>
      <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-brand-gray">
        {item.createdAt.toLocaleDateString()}
      </p>
    </div>
  );
};

export default Card;
