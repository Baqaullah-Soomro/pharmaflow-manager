
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-32 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PageContainer;
