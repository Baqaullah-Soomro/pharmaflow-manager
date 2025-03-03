
import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  Search, 
  Edit, 
  ArrowRight,
  FileSearch
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';
import { useToast } from '@/components/ui/use-toast';

// Mock data for cash transactions
const mockTransactions = [
  { id: 1, date: '2024-04-01', city: 'Lahore', name: 'Memorial Hospital', receipt: 5000, payment: 0, details: 'Payment received for Invoice #1001', previousBalance: 12000, balanceAmount: 7000, cashAccount: 'Main Account' },
  { id: 2, date: '2024-04-02', city: 'Karachi', name: 'City Clinic', receipt: 0, payment: 2500, details: 'Payment for supplies', previousBalance: 3500, balanceAmount: 6000, cashAccount: 'Main Account' },
  { id: 3, date: '2024-04-05', city: 'Islamabad', name: 'Riverside Medical', receipt: 7500, payment: 0, details: 'Payment received for Invoice #1002', previousBalance: 20000, balanceAmount: 12500, cashAccount: 'Secondary Account' },
  { id: 4, date: '2024-04-10', city: 'Rawalpindi', name: 'Lakeside Pharmacy', receipt: 0, payment: 4000, details: 'Monthly rent payment', previousBalance: 0, balanceAmount: 4000, cashAccount: 'Main Account' },
  { id: 5, date: '2024-04-15', city: 'Lahore', name: 'General Hospital', receipt: 9000, payment: 0, details: 'Payment received for Invoice #1003', previousBalance: 15000, balanceAmount: 6000, cashAccount: 'Main Account' },
];

// Mock data for salesmen, cities, and areas
const mockSalesmen = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'David Martinez' },
  { id: 3, name: 'Sarah Johnson' },
];

const mockCities = [
  { id: 1, name: 'Lahore' },
  { id: 2, name: 'Karachi' },
  { id: 3, name: 'Islamabad' },
  { id: 4, name: 'Rawalpindi' },
];

const mockAreas = [
  { id: 1, cityId: 1, name: 'Gulberg' },
  { id: 2, cityId: 1, name: 'Defence' },
  { id: 3, cityId: 2, name: 'Clifton' },
  { id: 4, cityId: 2, name: 'DHA' },
  { id: 5, cityId: 3, name: 'F-10' },
  { id: 6, cityId: 3, name: 'G-9' },
  { id: 7, cityId: 4, name: 'Saddar' },
  { id: 8, cityId: 4, name: 'Chaklala' },
];

const CashBook = () => {
  const [cashBookNo, setCashBookNo] = useState('CB-2024-0001');
  const [cashInHand, setCashInHand] = useState(50000);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [supplyNo, setSupplyNo] = useState('');
  const [currentTransaction, setCurrentTransaction] = useState({
    id: 0,
    date: new Date().toISOString().split('T')[0],
    city: '',
    name: '',
    receipt: 0,
    payment: 0,
    details: '',
    previousBalance: 0,
    balanceAmount: 0,
    cashAccount: 'Main Account'
  });
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [transactions, setTransactions] = useState(mockTransactions);
  
  const { toast } = useToast();

  // Filter areas based on selected city
  const filteredAreas = mockAreas.filter(area => 
    selectedCity ? area.cityId === parseInt(selectedCity) : true
  );

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.name.toLowerCase().includes(searchLower) ||
      transaction.city.toLowerCase().includes(searchLower) ||
      transaction.details.toLowerCase().includes(searchLower)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentTransaction(prev => ({
      ...prev,
      [name]: name === 'receipt' || name === 'payment' || name === 'previousBalance' || name === 'balanceAmount' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const resetForm = () => {
    setCurrentTransaction({
      id: 0,
      date: new Date().toISOString().split('T')[0],
      city: '',
      name: '',
      receipt: 0,
      payment: 0,
      details: '',
      previousBalance: 0,
      balanceAmount: 0,
      cashAccount: 'Main Account'
    });
    setFormMode('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'add') {
      // Add new transaction
      const newTransaction = {
        ...currentTransaction,
        id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1
      };
      
      setTransactions([...transactions, newTransaction]);
      toast({
        title: "Transaction Added",
        description: `Transaction has been added to the cash book.`,
      });
    } else {
      // Update existing transaction
      setTransactions(transactions.map(t => t.id === currentTransaction.id ? currentTransaction : t));
      toast({
        title: "Transaction Updated",
        description: `Transaction has been updated successfully.`,
      });
    }
    
    resetForm();
  };

  const handleEdit = (transaction: any) => {
    setCurrentTransaction(transaction);
    setFormMode('edit');
  };

  return (
    <PageContainer 
      title="Cash Book" 
      subtitle="Manage and track cash transactions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Cash Book Header */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cash Book</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
                <Button onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="cashBookNo" className="block text-sm font-medium mb-1">Cash Book No</label>
                <input
                  id="cashBookNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={cashBookNo}
                  onChange={(e) => setCashBookNo(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="cashInHand" className="block text-sm font-medium mb-1">Cash in Hand</label>
                <input
                  id="cashInHand"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={cashInHand}
                  onChange={(e) => setCashInHand(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label htmlFor="salesman" className="block text-sm font-medium mb-1">Salesman</label>
                <select
                  id="salesman"
                  name="salesman"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedSalesman}
                  onChange={(e) => setSelectedSalesman(e.target.value)}
                >
                  <option value="">Select Salesman</option>
                  {mockSalesmen.map(salesman => (
                    <option key={salesman.id} value={salesman.id.toString()}>{salesman.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="supplyNo" className="block text-sm font-medium mb-1">Supply No</label>
                <input
                  id="supplyNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={supplyNo}
                  onChange={(e) => setSupplyNo(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                <select
                  id="city"
                  name="city"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedArea('');
                    setCurrentTransaction(prev => ({ ...prev, city: mockCities.find(c => c.id === parseInt(e.target.value))?.name || '' }));
                  }}
                >
                  <option value="">Select City</option>
                  {mockCities.map(city => (
                    <option key={city.id} value={city.id.toString()}>{city.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="area" className="block text-sm font-medium mb-1">Area</label>
                <select
                  id="area"
                  name="area"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  disabled={!selectedCity}
                >
                  <option value="">Select Area</option>
                  {filteredAreas.map(area => (
                    <option key={area.id} value={area.id.toString()}>{area.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentTransaction.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentTransaction.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div>
                <label htmlFor="receipt" className="block text-sm font-medium mb-1">Receipt</label>
                <input
                  id="receipt"
                  name="receipt"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentTransaction.receipt}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="payment" className="block text-sm font-medium mb-1">Payment</label>
                <input
                  id="payment"
                  name="payment"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentTransaction.payment}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="previousBalance" className="block text-sm font-medium mb-1">Previous Balance</label>
                <input
                  id="previousBalance"
                  name="previousBalance"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentTransaction.previousBalance}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="balanceAmount" className="block text-sm font-medium mb-1">Balance Amount</label>
                <input
                  id="balanceAmount"
                  name="balanceAmount"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentTransaction.balanceAmount}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="lg:col-span-2">
                <label htmlFor="details" className="block text-sm font-medium mb-1">Details</label>
                <textarea
                  id="details"
                  name="details"
                  rows={2}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentTransaction.details}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="lg:col-span-2">
                <label htmlFor="cashAccount" className="block text-sm font-medium mb-1">Cash Account</label>
                <select
                  id="cashAccount"
                  name="cashAccount"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentTransaction.cashAccount}
                  onChange={handleInputChange}
                >
                  <option value="Main Account">Main Account</option>
                  <option value="Secondary Account">Secondary Account</option>
                  <option value="Petty Cash">Petty Cash</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Transactions List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Transactions</CardTitle>
              <div className="w-1/3">
                <SearchInput 
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search transactions..."
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">City</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Receipt</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Details</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Balance</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <tr 
                        key={transaction.id} 
                        className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm">{transaction.date}</td>
                        <td className="px-4 py-3 text-sm">{transaction.city}</td>
                        <td className="px-4 py-3 text-sm">{transaction.name}</td>
                        <td className="px-4 py-3 text-sm text-right">${transaction.receipt.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right">${transaction.payment.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate">{transaction.details}</td>
                        <td className="px-4 py-3 text-sm text-right">${transaction.balanceAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center justify-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(transaction)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        <FileSearch className="h-8 w-8 mx-auto mb-2" />
                        {searchTerm ? 'No transactions match your search criteria' : 'No transactions have been added yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between mt-6">
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
              
              <Button variant="outline">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CashBook;
