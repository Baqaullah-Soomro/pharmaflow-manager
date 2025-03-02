
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, BarChart, Database, Package, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { CustomButton } from '@/components/ui/CustomButton';

const Index = () => {
  // Refs for animation elements
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Package className="h-10 w-10 text-primary" />,
      title: 'Item Registration',
      description: 'Efficiently register, edit, and manage your medical products with detailed specifications.'
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: 'Sales Management',
      description: 'Process sales seamlessly with automated invoicing and receipt generation.'
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: 'Inventory Control',
      description: 'Keep track of your stock in real-time with expiry date monitoring and alerts.'
    },
    {
      icon: <RefreshCw className="h-10 w-10 text-primary" />,
      title: 'Returns Processing',
      description: 'Handle product returns efficiently with automated refund calculations.'
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: 'Compliance Ready',
      description: 'Built to international standards for medical product sales management.'
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: 'Advanced Reporting',
      description: 'Generate detailed reports on sales, inventory, and financial performance.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-medical-light"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 animate-on-scroll">
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-medical-light text-medical text-sm font-medium">
                Medical Products Management System
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-4">
                Streamline Your <span className="text-gradient">Medical Sales</span> Operations
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                A comprehensive solution for medical product inventory management, sales processing, and financial reporting. Built for compliance and efficiency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <CustomButton variant="premium" size="lg" asChild>
                  <Link to="/dashboard">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </CustomButton>
                <CustomButton variant="outline3D" size="lg" asChild>
                  <Link to="/products">Explore Features</Link>
                </CustomButton>
              </div>
            </div>
            <div className="flex-1 animate-on-scroll">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-medical to-medical-dark rounded-2xl blur opacity-30"></div>
                <div className="glass-card p-1 relative">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Medical Dashboard"
                    className="rounded-xl w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Suite of Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your medical products sales operation in one integrated platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="animate-on-scroll" 
                style={{ animationDelay: `${index * 0.1}s` }}
                hover
              >
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-medical-light to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="glass-card p-8 md:p-12 animate-on-scroll">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Medical Sales Operations?</h2>
              <p className="text-muted-foreground mb-8">
                Start using MedFlow today and experience the difference of a purpose-built system for medical products management.
              </p>
              <CustomButton variant="premium" size="lg" asChild>
                <Link to="/dashboard">Get Started Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </CustomButton>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
