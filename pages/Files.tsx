import React from 'react';

const Files: React.FC = () => {
  return (
    <div className="w-full pb-20 md:pb-0">
      <header className="mb-8">
        <h1 className="text-4xl font-black uppercase text-brand-text">My Files</h1>
        <p className="text-brand-text-light mt-1">Manage your uploaded files and folders.</p>
      </header>
      {/* Files and folders will be displayed here */}
    </div>
  );
};

export default Files;
