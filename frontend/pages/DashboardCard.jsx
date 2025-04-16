import React from 'react';

export const DashboardCard = ({ icon, label, onClick }) => {
  return (
    <button
      className="flex items-center w-[300px] sm:w-[350px] h-[250px] border border-gray-300 rounded-xl shadow-lg bg-white hover:shadow-2xl transition px-6 sm:px-8"
      onClick={onClick}
      aria-label={label}
    >
      <div className="w-[150px] h-[100px] flex items-center justify-center">
        {icon}
      </div>
      <span className="text-lg sm:text-3xl text-gray-900 ml-6">{label}</span>
    </button>
  );
};

export default DashboardCard;
