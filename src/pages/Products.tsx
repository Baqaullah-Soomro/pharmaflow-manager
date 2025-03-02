
import React, { useState } from 'react';
import { 
  ChevronDown, 
  Filter, 
  Package, 
  Plus, 
  Search, 
  SlidersHorizontal,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowUpDown
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';

// Mock data for products
const mockProducts = [
  {
    id: "PRD-001",
    name: "Surgical Gloves (Large)",
    category: "Protective Equipment",
    supplier: "MediSupply Inc.",
    stock: 120,
    price: 45.99,
    expiryDate: "2024-12-31"
  },
  {
    id: "PRD-002",
    name: "Digital Thermometer",
    category: "Diagnostic",
    supplier: "TechMed Solutions",
    stock: 35,
    price: 89.99,
    expiryDate: "N/A"
  },
  {
    id: "PRD-003",
    name: "Bandages (Premium)",
    category: "Wound Care",
    supplier: "HealthFirst",
    stock: 75,
    price: 34.50,
    expiryDate: "2025-06-15"
  },
  {
    id: "PRD-004",
    name: "Disinfectant Solution",
    category: "Sanitization",
    supplier: "CleanMed",
    stock: 48,
    price: 62.25,
    expiryDate: "2024-09-20"
  },
  {
    id: "PRD-005",
    name: "Penicillin Injection",
    category: "Medications",
    supplier: "PharmaPlus",
    stock: 15,
    price: 124.99,
    expiryDate: "2024-02-28"
  },
  {
    id: "PRD-006",
    name: "Blood Pressure Monitor",
    category: "Diagnostic",
    supplier: "TechMed Solutions",
    stock: 22,
    price: 199.99,
    expiryDate: "N/A"
  },
  {
    id: "PRD-007",
    name: "Insulin Syringes",
    category: "Injection",
    supplier: "DiabCare",
    stock: 68,
    price: 29.99,
    expiryDate: "2024-11-15"
  },
  {
    id: "PRD-008",
    name: "Surgical Mask (50pcs)",
    category: "Protective Equipment",
    supplier: "MediSupply Inc.",
    stock: 160,
    price: 19.99,
    expiryDate: "2026-01-01"
  }
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products] = useState(mockProducts);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(products.map(product => product.category))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-32 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground">Manage your medical product inventory</p>
            </div>
            <div className="mt-4 md:mt-0">
              <CustomButton variant="premium" size="lg" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Add New Product
              </CustomButton>
            </div>
          </div>
          
          {/* Filters and Search */}
          <Card className="mb-8 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 py-2 rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      className="appearance-none w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                  </div>
                  
                  <CustomButton variant="outline3D" size="icon" className="h-10 w-10">
                    <Filter className="h-4 w-4" />
                  </CustomButton>
                  
                  <CustomButton variant="outline3D" size="icon" className="h-10 w-10">
                    <SlidersHorizontal className="h-4 w-4" />
                  </CustomButton>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Products Table */}
          <Card className="animate-fade-in animate-delay-100">
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                {filteredProducts.length} products found{searchTerm ? ` for "${searchTerm}"` : ''}
                {selectedCategory ? ` in ${selectedCategory}` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/80">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        <div className="flex items-center">
                          ID <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        <div className="flex items-center">
                          Product <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Supplier</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        <div className="flex items-center">
                          Stock <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        <div className="flex items-center">
                          Price <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Expiry</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr 
                        key={product.id} 
                        className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-medium">{product.id}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                            {product.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{product.category}</td>
                        <td className="px-4 py-3 text-sm">{product.supplier}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`${
                            product.stock < 20 
                              ? 'text-red-500' 
                              : product.stock < 50 
                                ? 'text-amber-500' 
                                : 'text-green-500'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          {product.expiryDate === 'N/A' ? (
                            <span className="text-muted-foreground">N/A</span>
                          ) : (
                            <span className={`${
                              new Date(product.expiryDate) < new Date(Date.now() + 30*24*60*60*1000) 
                                ? 'text-red-500' 
                                : 'text-foreground'
                            }`}>
                              {new Date(product.expiryDate).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <CustomButton variant="ghost3D" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </CustomButton>
                            <CustomButton variant="ghost3D" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </CustomButton>
                            <CustomButton variant="ghost3D" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </CustomButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
