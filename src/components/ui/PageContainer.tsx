
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title, subtitle, icon }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      
      <main className="flex-1 ml-20 md:ml-64 py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            {icon && <div>{icon}</div>}
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PageContainer;
