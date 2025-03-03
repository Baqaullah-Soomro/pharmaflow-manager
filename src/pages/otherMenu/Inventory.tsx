
import React, { useState, useEffect } from 'react';
import { Package, Filter, Calendar, BarChart3 } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';

// Mock data for companies, items, and types
const companies = ['MediCorp', 'PharmaSolutions', 'HealthTech', 'MediGlobal', 'BioLife'];
const itemTypes = ['Antibiotics', 'Painkillers', 'Vitamins', 'Vaccines', 'Medical Devices', 'Supplies'];

// Mock inventory data
const mockInventory = [
  { id: 1, itemCode: 'MED001', company: 'MediCorp', itemName: 'Paracetamol 500mg', type: 'Painkillers', packing: '10x10', purchase: 150, purchaseReturn: 5, sales: 120, salesReturn: 2, stock: 27, bonus: 10, balance: 37 },
  { id: 2, itemCode: 'MED002', company: 'PharmaSolutions', itemName: 'Amoxicillin 250mg', type: 'Antibiotics', packing: '6x10', purchase: 200, purchaseReturn: 0, sales: 180, salesReturn: 5, stock: 25, bonus: 15, balance: 40 },
  { id: 3, itemCode: 'MED003', company: 'HealthTech', itemName: 'Vitamin C 1000mg', type: 'Vitamins', packing: '3x10', purchase: 100, purchaseReturn: 2, sales: 75, salesReturn: 0, stock: 23, bonus: 5, balance: 28 },
  { id: 4, itemCode: 'MED004', company: 'MediGlobal', itemName: 'Flu Vaccine', type: 'Vaccines', packing: '1x10', purchase: 50, purchaseReturn: 0, sales: 42, salesReturn: 1, stock: 9, bonus: 0, balance: 9 },
  { id: 5, itemCode: 'MED005', company: 'BioLife', itemName: 'Digital Thermometer', type: 'Medical Devices', packing: '1x1', purchase: 30, purchaseReturn: 1, sales: 25, salesReturn: 2, stock: 6, bonus: 0, balance: 6 },
  { id: 6, itemCode: 'MED006', company: 'MediCorp', itemName: 'Surgical Masks', type: 'Supplies', packing: '50x1', purchase: 500, purchaseReturn: 0, sales: 450, salesReturn: 0, stock: 50, bonus: 25, balance: 75 },
  { id: 7, itemCode: 'MED007', company: 'PharmaSolutions', itemName: 'Ibuprofen 400mg', type: 'Painkillers', packing: '10x10', purchase: 120, purchaseReturn: 3, sales: 95, salesReturn: 5, stock: 27, bonus: 8, balance: 35 },
  { id: 8, itemCode: 'MED008', company: 'HealthTech', itemName: 'Multivitamin Tablets', type: 'Vitamins', packing: '3x10', purchase: 80, purchaseReturn: 0, sales: 60, salesReturn: 2, stock: 22, bonus: 4, balance: 26 },
];

// Filter options
const filterOptions = [
  { id: 'company', name: 'By Company' },
  { id: 'item', name: 'By Item' },
  { id: 'type', name: 'By Type' }
];

const Inventory = () => {
  const [inventory, setInventory] = useState(mockInventory);
  const [filteredInventory, setFilteredInventory] = useState(mockInventory);
  
  // Filter state
  const [filterType, setFilterType] = useState('company');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calculate total stock value
  const calculateTotalStockValue = () => {
    return filteredInventory.reduce((total, item) => {
      // For simplicity, using a basic calculation. In a real app, would use actual cost values
      return total + (item.stock * 10); // Assuming an average cost of 10 per unit
    }, 0);
  };
  
  // Apply filters
  useEffect(() => {
    let filtered = [...inventory];
    
    // Filter by search term first (if any)
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filter based on selected filter type
    if (filterType === 'company' && selectedCompany) {
      filtered = filtered.filter(item => item.company === selectedCompany);
    } else if (filterType === 'item' && selectedItem) {
      filtered = filtered.filter(item => item.itemCode === selectedItem);
    } else if (filterType === 'type' && selectedItemType) {
      filtered = filtered.filter(item => item.type === selectedItemType);
    }
    
    setFilteredInventory(filtered);
  }, [inventory, searchTerm, filterType, selectedCompany, selectedItem, selectedItemType]);
  
  return (
    <PageContainer 
      title="Inventory" 
      subtitle="Manage and monitor your inventory levels"
    >
      <div className="space-y-8">
        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Filters</CardTitle>
            <CardDescription>Filter your inventory by different criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="filterType" className="block text-sm font-medium mb-1">Filter By</label>
                <select
                  id="filterType"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {filterOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
              
              {filterType === 'company' && (
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                  <select
                    id="company"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    <option value="">All Companies</option>
                    {companies.map((company, index) => (
                      <option key={index} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {filterType === 'item' && (
                <div>
                  <label htmlFor="item" className="block text-sm font-medium mb-1">Item</label>
                  <select
                    id="item"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    <option value="">All Items</option>
                    {inventory.map((item) => (
                      <option key={item.id} value={item.itemCode}>
                        {item.itemCode} - {item.itemName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {filterType === 'type' && (
                <div>
                  <label htmlFor="itemType" className="block text-sm font-medium mb-1">Item Type</label>
                  <select
                    id="itemType"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={selectedItemType}
                    onChange={(e) => setSelectedItemType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {itemTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="startDate"
                    type="date"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="endDate"
                    type="date"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="search" className="block text-sm font-medium mb-1">Search</label>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search by name, code, company..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-primary mr-2" />
                <div className="text-2xl font-bold">{filteredInventory.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-primary mr-2" />
                <div className="text-2xl font-bold">
                  {filteredInventory.reduce((sum, item) => sum + item.stock, 0)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-primary mr-2" />
                <div className="text-2xl font-bold">
                  ${calculateTotalStockValue().toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stock with Bonus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-primary mr-2" />
                <div className="text-2xl font-bold">
                  {filteredInventory.reduce((sum, item) => sum + item.balance, 0)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>Complete inventory with stock levels and movement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left">Item Code</th>
                    <th className="px-3 py-2 text-left">Item Name</th>
                    <th className="px-3 py-2 text-left">Company</th>
                    <th className="px-3 py-2 text-center">Packing</th>
                    <th className="px-3 py-2 text-center">Purchase</th>
                    <th className="px-3 py-2 text-center">Purchase Return</th>
                    <th className="px-3 py-2 text-center">Sales</th>
                    <th className="px-3 py-2 text-center">Sales Return</th>
                    <th className="px-3 py-2 text-center">Stock</th>
                    <th className="px-3 py-2 text-center">Bonus</th>
                    <th className="px-3 py-2 text-center">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-3 py-2">{item.itemCode}</td>
                        <td className="px-3 py-2">{item.itemName}</td>
                        <td className="px-3 py-2">{item.company}</td>
                        <td className="px-3 py-2 text-center">{item.packing}</td>
                        <td className="px-3 py-2 text-center">{item.purchase}</td>
                        <td className="px-3 py-2 text-center">{item.purchaseReturn}</td>
                        <td className="px-3 py-2 text-center">{item.sales}</td>
                        <td className="px-3 py-2 text-center">{item.salesReturn}</td>
                        <td className="px-3 py-2 text-center font-semibold">{item.stock}</td>
                        <td className="px-3 py-2 text-center">{item.bonus}</td>
                        <td className="px-3 py-2 text-center font-semibold">{item.balance}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-4 py-4 text-center text-muted-foreground">
                        No inventory items found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/80 font-semibold">
                    <td colSpan={4} className="px-3 py-2 text-right">Totals:</td>
                    <td className="px-3 py-2 text-center">
                      {filteredInventory.reduce((sum, item) => sum + item.purchase, 0)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {filteredInventory.reduce((sum, item) => sum + item.purchaseReturn, 0)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {filteredInventory.reduce((sum, item) => sum + item.sales, 0)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {filteredInventory.reduce((sum, item) => sum + item.salesReturn, 0)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {filteredInventory.reduce((sum, item) => sum + item.stock, 0)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {filteredInventory.reduce((sum, item) => sum + item.bonus, 0)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {filteredInventory.reduce((sum, item) => sum + item.balance, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-4 flex justify-end">
              <CustomButton 
                variant="premium"
                className="ml-2"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Inventory Report
              </CustomButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Inventory;
