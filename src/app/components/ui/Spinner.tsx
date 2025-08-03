import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div
        className="w-12 h-12 rounded-full animate-spin
                    border-4 border-solid border-blue-500 border-t-transparent"
      ></div>
    </div>
  );
};

export default Spinner;