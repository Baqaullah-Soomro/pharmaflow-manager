
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CustomButton } from '@/components/ui/CustomButton';
import { Package, Calendar as CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import SearchInput from '@/components/ui/SearchInput';

// Mock data
const companies = ['ABC Pharma', 'MedTech Labs', 'Healthcare Solutions', 'Vital Meds Inc.', 'PharmaCare'];
const itemTypes = ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment'];

// Generate mock inventory data
const generateInventoryItems = () => {
  const items = [];
  const itemNames = [
    'Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Aspirin', 'Diclofenac', 
    'Metformin', 'Atorvastatin', 'Omeprazole', 'Losartan', 'Amlodipine'
  ];
  
  for (let i = 0; i < 20; i++) {
    const itemName = itemNames[i % itemNames.length];
    const company = companies[i % companies.length];
    const purchase = Math.floor(Math.random() * 1000) + 100;
    const purchaseReturn = Math.floor(Math.random() * 50);
    const sales = Math.floor(Math.random() * 800);
    const salesReturn = Math.floor(Math.random() * 30);
    const bonus = Math.floor(Math.random() * 20);
    
    items.push({
      id: `ITEM${String(i + 1).padStart(3, '0')}`,
      itemName,
      company,
      type: itemTypes[i % itemTypes.length],
      purchase,
      purchaseReturn,
      sales,
      salesReturn,
      stock: purchase - purchaseReturn - sales + salesReturn,
      bonus,
      balance: purchase - purchaseReturn - sales + salesReturn + bonus
    });
  }
  
  return items;
};

const inventoryItems = generateInventoryItems();

const Inventory = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState('company');
  const [filterValue, setFilterValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(inventoryItems);
  const [stockValue, setStockValue] = useState(0);
  
  useEffect(() => {
    // Filter items based on filter type and value
    let filtered = inventoryItems;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply dropdown filter
    if (filterValue) {
      filtered = filtered.filter(item => {
        if (filterType === 'company') return item.company === filterValue;
        if (filterType === 'type') return item.type === filterValue;
        return true;
      });
    }
    
    setFilteredItems(filtered);
    
    // Calculate total stock value (assuming a mock price per unit)
    const totalValue = filtered.reduce((sum, item) => {
      const pricePerUnit = Math.floor(Math.random() * 10) + 1; // Random price for demo
      return sum + (item.stock * pricePerUnit);
    }, 0);
    
    setStockValue(totalValue);
  }, [filterType, filterValue, searchTerm]);

  const getFilterOptions = () => {
    if (filterType === 'company') return companies;
    if (filterType === 'type') return itemTypes;
    return [];
  };

  return (
    <PageContainer 
      title="Inventory Management" 
      subtitle="Track and manage your inventory levels"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Status
                </CardTitle>
                <CardDescription>
                  View current inventory levels and movements
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <CustomButton
                      variant="outline3D"
                      className="w-full sm:w-auto justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "PPP")}
                    </CustomButton>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <span>Stock Value:</span>
                  <span className="font-semibold text-foreground">${stockValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="company" className="w-full">
              <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                <div className="flex-1 md:w-72">
                  <SearchInput 
                    value={searchTerm} 
                    onChange={setSearchTerm} 
                    placeholder="Search inventory..."
                    className="w-full"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <TabsList className="grid w-full sm:w-auto grid-cols-3">
                    <TabsTrigger 
                      value="company" 
                      onClick={() => {
                        setFilterType('company');
                        setFilterValue('');
                      }}
                    >
                      By Company
                    </TabsTrigger>
                    <TabsTrigger 
                      value="item" 
                      onClick={() => {
                        setFilterType('item');
                        setFilterValue('');
                      }}
                    >
                      By Item
                    </TabsTrigger>
                    <TabsTrigger 
                      value="type" 
                      onClick={() => {
                        setFilterType('type');
                        setFilterValue('');
                      }}
                    >
                      By Type
                    </TabsTrigger>
                  </TabsList>
                  
                  <Select
                    value={filterValue}
                    onValueChange={setFilterValue}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder={`Select ${filterType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {getFilterOptions().map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="text-right">Purchase</TableHead>
                      <TableHead className="text-right">P.Return</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">S.Return</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Bonus</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.company}</TableCell>
                          <TableCell className="text-right">{item.purchase}</TableCell>
                          <TableCell className="text-right">{item.purchaseReturn}</TableCell>
                          <TableCell className="text-right">{item.sales}</TableCell>
                          <TableCell className="text-right">{item.salesReturn}</TableCell>
                          <TableCell 
                            className={cn(
                              "text-right font-medium", 
                              item.stock <= 10 ? "text-red-500" : 
                              item.stock <= 50 ? "text-yellow-500" : 
                              "text-green-500"
                            )}
                          >
                            {item.stock}
                          </TableCell>
                          <TableCell className="text-right">{item.bonus}</TableCell>
                          <TableCell className="text-right font-medium">{item.balance}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          No inventory items found matching the current filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <CustomButton
                  variant="outline3D"
                  onClick={() => {
                    alert('Exporting inventory report...');
                  }}
                >
                  Export Report
                </CustomButton>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Inventory;
