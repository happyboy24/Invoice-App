import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pt-4 pb-12">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
