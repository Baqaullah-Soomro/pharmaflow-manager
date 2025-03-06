
import React, { useState } from 'react';
import { BarChart4, Plus, Trash2 } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomButton } from '@/components/ui/CustomButton';
import { Label } from '@/components/ui/label';

// Mock data for companies
const mockCompanies = [
  { id: 1, name: 'ABC Pharmaceuticals' },
  { id: 2, name: 'MediCore Inc.' },
  { id: 3, name: 'HealthPlus Supplies' },
  { id: 4, name: 'PharmaTech Solutions' },
];

// Mock data for sales persons
const mockSalesPersons = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Robert Johnson' },
  { id: 4, name: 'Emily Williams' },
];

// Mock data for items
const mockItems = [
  { id: 1, name: 'Paracetamol 500mg', company: 'ABC Pharmaceuticals', price: 15.99 },
  { id: 2, name: 'Amoxicillin 250mg', company: 'MediCore Inc.', price: 23.50 },
  { id: 3, name: 'Vitamin C 1000mg', company: 'HealthPlus Supplies', price: 12.75 },
  { id: 4, name: 'Omeprazole 20mg', company: 'PharmaTech Solutions', price: 18.20 },
];

const SalesTarget = () => {
  const [targetNo, setTargetNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [bonus, setBonus] = useState('');
  const [returnQty, setReturnQty] = useState('');
  const [returnBonus, setReturnBonus] = useState('');
  const [activeTab, setActiveTab] = useState('target');
  
  // State for added companies/items list
  const [targetItems, setTargetItems] = useState<Array<{
    id: number;
    company: string;
    item: string;
    price: number;
    quantity: number;
    amount: number;
    bonus: number;
  }>>([]);

  const handleAddCompany = () => {
    if (selectedCompany && selectedItem && quantity && price) {
      const newAmount = Number(quantity) * Number(price);
      
      setTargetItems([
        ...targetItems,
        {
          id: Date.now(),
          company: selectedCompany,
          item: selectedItem,
          price: Number(price),
          quantity: Number(quantity),
          amount: newAmount,
          bonus: Number(bonus) || 0
        }
      ]);
      
      // Reset fields
      setSelectedItem('');
      setQuantity('');
      setPrice('');
      setAmount('');
      setBonus('');
    }
  };

  const handleDeleteCompany = (id: number) => {
    setTargetItems(targetItems.filter(item => item.id !== id));
  };

  const totalTargetAmount = targetItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <PageContainer 
      title="Sales Target" 
      subtitle="Set and monitor sales targets for your team"
      icon={<BarChart4 className="h-6 w-6 text-primary" />}
    >
      <Tabs defaultValue="target" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="target" onClick={() => setActiveTab('target')}>Target Setup</TabsTrigger>
          <TabsTrigger value="reports" onClick={() => setActiveTab('reports')}>Sales Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="target" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetNo">Target No</Label>
                  <Input 
                    id="targetNo" 
                    value={targetNo} 
                    onChange={(e) => setTargetNo(e.target.value)}
                    placeholder="Target No"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salesPerson">Sales Person</Label>
                  <Select 
                    value={salesPerson} 
                    onValueChange={setSalesPerson}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sales person" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSalesPersons.map((person) => (
                        <SelectItem key={person.id} value={person.name}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input 
                    id="targetAmount" 
                    value={totalTargetAmount > 0 ? totalTargetAmount.toFixed(2) : targetAmount} 
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="Target Amount"
                    readOnly={totalTargetAmount > 0}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Add Items to Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select 
                    value={selectedCompany} 
                    onValueChange={setSelectedCompany}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.name}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Select 
                    value={selectedItem} 
                    onValueChange={(val) => {
                      setSelectedItem(val);
                      const item = mockItems.find(i => i.name === val);
                      if (item) {
                        setPrice(item.price.toString());
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockItems
                        .filter(item => !selectedCompany || item.company === selectedCompany)
                        .map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salesPrice">Sales Price</Label>
                  <Input 
                    id="salesPrice" 
                    value={price} 
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (quantity) {
                        setAmount((Number(e.target.value) * Number(quantity)).toString());
                      }
                    }}
                    placeholder="Price"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    value={quantity} 
                    onChange={(e) => {
                      setQuantity(e.target.value);
                      if (price) {
                        setAmount((Number(e.target.value) * Number(price)).toString());
                      }
                    }}
                    placeholder="Quantity"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input 
                    id="amount" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bonus">Bonus</Label>
                  <Input 
                    id="bonus" 
                    value={bonus} 
                    onChange={(e) => setBonus(e.target.value)}
                    placeholder="Bonus"
                  />
                </div>
                
                <div className="flex items-end pb-1">
                  <Button 
                    onClick={handleAddCompany}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
              
              {targetItems.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {targetItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.company}</TableCell>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.amount.toFixed(2)}</TableCell>
                        <TableCell>{item.bonus}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteCompany(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="flex justify-end space-x-4">
                <CustomButton variant="outline3D">
                  Target Report
                </CustomButton>
                <CustomButton variant="outline3D">
                  Sales Report
                </CustomButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Target vs Achievement Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add reports content here */}
              <p className="text-muted-foreground">Reports functionality will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default SalesTarget;
