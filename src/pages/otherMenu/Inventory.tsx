
import React, { useState } from 'react';
import { Package, Calendar, Filter, FileText, DollarSign, Layers, ShoppingCart, ArrowDownLeft, ArrowUpRight, Plus, Minus } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import SearchInput from '@/components/ui/SearchInput';

// Mock data for inventory items
const mockInventoryItems = [
  { 
    id: 1,
    itemName: 'Surgical Gloves',
    company: 'MediTech',
    type: 'Supplies',
    purchase: 250,
    purchaseReturn: 10,
    sales: 190,
    salesReturn: 5,
    stock: 55,
    bonus: 0,
    balance: 55,
    unitPrice: 45.99,
    stockValue: 2529.45
  },
  { 
    id: 2,
    itemName: 'Digital Thermometer',
    company: 'HealthFirst',
    type: 'Equipment',
    purchase: 100,
    purchaseReturn: 2,
    sales: 78,
    salesReturn: 3,
    stock: 23,
    bonus: 0,
    balance: 23,
    unitPrice: 89.99,
    stockValue: 2069.77
  },
  { 
    id: 3,
    itemName: 'Antibacterial Soap',
    company: 'CleanMed',
    type: 'Supplies',
    purchase: 500,
    purchaseReturn: 0,
    sales: 425,
    salesReturn: 15,
    stock: 90,
    bonus: 10,
    balance: 100,
    unitPrice: 12.50,
    stockValue: 1250.00
  },
  { 
    id: 4,
    itemName: 'Blood Pressure Monitor',
    company: 'HealthFirst',
    type: 'Equipment',
    purchase: 75,
    purchaseReturn: 5,
    sales: 40,
    salesReturn: 0,
    stock: 30,
    bonus: 0,
    balance: 30,
    unitPrice: 125.00,
    stockValue: 3750.00
  },
  { 
    id: 5,
    itemName: 'Paracetamol Tablets',
    company: 'PharmaCare',
    type: 'Medicine',
    purchase: 1000,
    purchaseReturn: 0,
    sales: 850,
    salesReturn: 20,
    stock: 170,
    bonus: 50,
    balance: 220,
    unitPrice: 5.99,
    stockValue: 1317.80
  },
  { 
    id: 6,
    itemName: 'Examination Gown',
    company: 'MediTech',
    type: 'Supplies',
    purchase: 300,
    purchaseReturn: 0,
    sales: 275,
    salesReturn: 5,
    stock: 30,
    bonus: 0,
    balance: 30,
    unitPrice: 18.25,
    stockValue: 547.50
  },
  { 
    id: 7,
    itemName: 'Insulin Syringes',
    company: 'PharmaCare',
    type: 'Supplies',
    purchase: 800,
    purchaseReturn: 0,
    sales: 650,
    salesReturn: 0,
    stock: 150,
    bonus: 25,
    balance: 175,
    unitPrice: 3.50,
    stockValue: 612.50
  },
];

// Companies
const companies = ['All', 'MediTech', 'HealthFirst', 'CleanMed', 'PharmaCare'];

// Item Types
const itemTypes = ['All', 'Supplies', 'Equipment', 'Medicine'];

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { toast } = useToast();

  // Calculate total inventory value
  const totalStockValue = inventoryItems.reduce((total, item) => total + item.stockValue, 0);

  // Filter inventory items based on search and filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = filterCompany === 'All' || item.company === filterCompany;
    const matchesType = filterType === 'All' || item.type === filterType;
    
    return matchesSearch && matchesCompany && matchesType;
  });

  const exportInventoryReport = () => {
    toast({
      title: "Report Export Initiated",
      description: "Inventory report is being exported as Excel file.",
    });
    // In a real application, you would handle the export functionality here
  };

  const printInventoryReport = () => {
    toast({
      title: "Print Initiated",
      description: "Sending inventory report to printer...",
    });
    // In a real application, you would handle printing here
  };

  return (
    <PageContainer
      title="Inventory"
      subtitle="Monitor and manage your product inventory levels"
    >
      <div className="space-y-6">
        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Inventory Filters
            </CardTitle>
            <CardDescription>
              Filter your inventory based on company, item type, and date range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Items</Label>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search by name or company..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Filter by Company</Label>
                <select
                  id="company"
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                >
                  {companies.map((company, index) => (
                    <option key={index} value={company}>{company}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Filter by Type</Label>
                <select
                  id="type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                >
                  {itemTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-1">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 rounded-md border border-input bg-background"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 rounded-md border border-input bg-background"
                    placeholder="To"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {startDate && endDate ? 
                  `Showing data from ${startDate} to ${endDate}` : 
                  'Showing all-time inventory data'}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={printInventoryReport}
              >
                <FileText className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={exportInventoryReport}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Inventory Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                  <h3 className="text-2xl font-bold mt-1">{filteredItems.length}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stock Value</p>
                  <h3 className="text-2xl font-bold mt-1">${totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Stock</p>
                  <h3 className="text-2xl font-bold mt-1">{filteredItems.reduce((sum, item) => sum + item.stock, 0)}</h3>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Layers className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Companies</p>
                  <h3 className="text-2xl font-bold mt-1">{new Set(filteredItems.map(item => item.company)).size}</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Inventory List
            </CardTitle>
            <CardDescription>
              Detailed view of all inventory items and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Item Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Company</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Purchase</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Purchase Return</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Sales</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Sales Return</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Bonus</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Balance</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Stock Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                      >
                        <td className="px-4 py-3 text-sm font-medium">{item.itemName}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.company === 'MediTech' ? 'bg-blue-100 text-blue-800' :
                            item.company === 'HealthFirst' ? 'bg-green-100 text-green-800' :
                            item.company === 'CleanMed' ? 'bg-purple-100 text-purple-800' :
                            item.company === 'PharmaCare' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.company}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex items-center justify-center">
                            <Plus className="h-3 w-3 mr-1 text-green-600" />
                            {item.purchase}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex items-center justify-center">
                            <Minus className="h-3 w-3 mr-1 text-red-600" />
                            {item.purchaseReturn}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex items-center justify-center">
                            <ArrowUpRight className="h-3 w-3 mr-1 text-amber-600" />
                            {item.sales}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex items-center justify-center">
                            <ArrowDownLeft className="h-3 w-3 mr-1 text-purple-600" />
                            {item.salesReturn}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-center font-semibold">{item.stock}</td>
                        <td className="px-4 py-3 text-sm text-center">{item.bonus}</td>
                        <td className="px-4 py-3 text-sm text-center font-semibold">{item.balance}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">${item.stockValue.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                        <Package className="mx-auto h-8 w-8 mb-2 opacity-20" />
                        {searchTerm || filterCompany !== 'All' || filterType !== 'All' ? 
                          'No inventory items match your search criteria' : 
                          'No inventory items found'}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-muted/30">
                  <tr className="border-t border-t-border/60">
                    <td colSpan={6} className="px-4 py-3 text-sm font-medium text-right">Total:</td>
                    <td className="px-4 py-3 text-sm font-bold text-center">{filteredItems.reduce((sum, item) => sum + item.stock, 0)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-center">{filteredItems.reduce((sum, item) => sum + item.bonus, 0)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-center">{filteredItems.reduce((sum, item) => sum + item.balance, 0)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-right">${filteredItems.reduce((sum, item) => sum + item.stockValue, 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Inventory;
