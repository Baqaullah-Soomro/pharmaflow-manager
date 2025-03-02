
import React, { useState } from 'react';
import { Plus, Save, Search, Edit, RefreshCw, FileSearch, ArrowRight } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';
import { useToast } from '@/components/ui/use-toast';

// Mock data for cash book entries
const mockCashEntries = [
  { id: 1, date: '2024-05-01', city: 'New York', name: 'Memorial Hospital', receipt: 1500.00, payment: 0, details: 'Payment received for invoice #1234', prevBalance: 5000.00, balance: 6500.00, cashAccount: 'Main Cash' },
  { id: 2, date: '2024-05-02', city: 'Chicago', name: 'City Clinic', receipt: 0, payment: 350.75, details: 'Office supplies', prevBalance: 3500.00, balance: 3149.25, cashAccount: 'Petty Cash' },
  { id: 3, date: '2024-05-03', city: 'Los Angeles', name: 'Riverside Medical', receipt: 2200.50, payment: 0, details: 'Payment for outstanding balance', prevBalance: 12000.00, balance: 14200.50, cashAccount: 'Main Cash' },
  { id: 4, date: '2024-05-04', city: 'Dallas', name: 'MediSuppliers', receipt: 0, payment: 875.25, details: 'Medical equipment purchase', prevBalance: 0, balance: -875.25, cashAccount: 'Main Cash' },
  { id: 5, date: '2024-05-05', city: 'New York', name: 'Lakeside Pharmacy', receipt: 450.00, payment: 0, details: 'Partial payment for invoice #5678', prevBalance: 2800.00, balance: 3250.00, cashAccount: 'Main Cash' },
];

// Mock data for salesmen, cities, areas, and supply numbers
const mockSalesmen = ['John Smith', 'Sarah Johnson', 'David Williams', 'Emma Brown'];
const mockCities = ['New York', 'Chicago', 'Los Angeles', 'Dallas', 'Boston', 'Miami'];
const mockAreas = ['Downtown', 'Midtown', 'Uptown', 'West Side', 'East Side', 'North Side', 'South Side'];
const mockSupplyNumbers = ['SUP-001', 'SUP-002', 'SUP-003', 'SUP-004', 'SUP-005'];

const CashBook = () => {
  const [cashBookNo, setCashBookNo] = useState('CB-2024-0001');
  const [cashInHand, setCashInHand] = useState(15000.00);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [receipt, setReceipt] = useState('');
  const [payment, setPayment] = useState('');
  const [details, setDetails] = useState('');
  const [cashAccount, setCashAccount] = useState('Main Cash');
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSupplyNo, setSelectedSupplyNo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(mockCashEntries);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  
  const { toast } = useToast();

  // Filter entries based on search
  const filteredEntries = entries.filter(entry => {
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.name.toLowerCase().includes(searchLower) ||
      entry.city.toLowerCase().includes(searchLower) ||
      entry.details.toLowerCase().includes(searchLower) ||
      entry.cashAccount.toLowerCase().includes(searchLower)
    );
  });

  const handleSave = () => {
    if (!city || !name || (!receipt && !payment) || !details) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const receiptValue = parseFloat(receipt) || 0;
    const paymentValue = parseFloat(payment) || 0;
    
    if (editingEntry) {
      // Update existing entry
      const updatedEntries = entries.map(entry => {
        if (entry.id === editingEntry.id) {
          return {
            ...entry,
            city,
            name,
            receipt: receiptValue,
            payment: paymentValue,
            details,
            cashAccount,
            // Recalculate balance
            balance: entry.prevBalance + receiptValue - paymentValue
          };
        }
        return entry;
      });
      
      setEntries(updatedEntries);
      toast({
        title: "Entry Updated",
        description: "Cash book entry has been updated successfully."
      });
    } else {
      // Add new entry
      const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
      const prevBalance = lastEntry ? lastEntry.balance : 0;
      
      const newEntry = {
        id: entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1,
        date,
        city,
        name,
        receipt: receiptValue,
        payment: paymentValue,
        details,
        prevBalance,
        balance: prevBalance + receiptValue - paymentValue,
        cashAccount
      };
      
      setEntries([...entries, newEntry]);
      toast({
        title: "Entry Added",
        description: "New cash book entry has been added successfully."
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setCity('');
    setName('');
    setReceipt('');
    setPayment('');
    setDetails('');
    setCashAccount('Main Cash');
    setEditingEntry(null);
  };

  const handleEdit = (entry: any) => {
    setCity(entry.city);
    setName(entry.name);
    setReceipt(entry.receipt.toString());
    setPayment(entry.payment.toString());
    setDetails(entry.details);
    setCashAccount(entry.cashAccount);
    setEditingEntry(entry);
  };

  const handleSearch = () => {
    toast({
      title: "Search Results",
      description: `Found ${filteredEntries.length} matching entries.`
    });
  };

  const handleNext = () => {
    setCashBookNo(`CB-2024-${Math.floor(1000 + Math.random() * 9000)}`);
    toast({
      title: "Next Cash Book",
      description: "Ready to create entries for the next cash book."
    });
  };

  return (
    <PageContainer 
      title="Cash Book" 
      subtitle="Track and manage cash transactions"
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
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingEntry ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label htmlFor="cashBookNo" className="block text-sm font-medium mb-1">Cash Book No</label>
                <input
                  id="cashBookNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={cashBookNo}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <input
                  id="date"
                  type="date"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="cashInHand" className="block text-sm font-medium mb-1">Cash in Hand</label>
                <input
                  id="cashInHand"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={`$${cashInHand.toFixed(2)}`}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="cashAccount" className="block text-sm font-medium mb-1">Cash Account</label>
                <select
                  id="cashAccount"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={cashAccount}
                  onChange={(e) => setCashAccount(e.target.value)}
                >
                  <option value="Main Cash">Main Cash</option>
                  <option value="Petty Cash">Petty Cash</option>
                  <option value="Bank Account">Bank Account</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label htmlFor="salesman" className="block text-sm font-medium mb-1">Salesman</label>
                <select
                  id="salesman"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedSalesman}
                  onChange={(e) => setSelectedSalesman(e.target.value)}
                >
                  <option value="">Select Salesman</option>
                  {mockSalesmen.map((salesman, index) => (
                    <option key={index} value={salesman}>{salesman}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="selectCity" className="block text-sm font-medium mb-1">City</label>
                <select
                  id="selectCity"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Select City</option>
                  {mockCities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="area" className="block text-sm font-medium mb-1">Area</label>
                <select
                  id="area"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  <option value="">Select Area</option>
                  {mockAreas.map((area, index) => (
                    <option key={index} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="supplyNo" className="block text-sm font-medium mb-1">Supply No</label>
                <select
                  id="supplyNo"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedSupplyNo}
                  onChange={(e) => setSelectedSupplyNo(e.target.value)}
                >
                  <option value="">Select Supply No</option>
                  {mockSupplyNumbers.map((supplyNo, index) => (
                    <option key={index} value={supplyNo}>{supplyNo}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                <input
                  id="city"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="details" className="block text-sm font-medium mb-1">Details</label>
                <input
                  id="details"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="receipt" className="block text-sm font-medium mb-1">Receipt</label>
                <input
                  id="receipt"
                  type="number"
                  step="0.01"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={receipt}
                  onChange={(e) => setReceipt(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="payment" className="block text-sm font-medium mb-1">Payment</label>
                <input
                  id="payment"
                  type="number"
                  step="0.01"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Cash Book Entries */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CardTitle>Cash Book Entries</CardTitle>
              <div className="flex items-center space-x-2">
                <SearchInput 
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search entries..."
                  className="w-64"
                />
                <Button variant="outline" size="icon" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Next
                </Button>
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
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Prev. Balance</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Balance</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry, index) => (
                      <tr 
                        key={entry.id} 
                        className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm">{entry.date}</td>
                        <td className="px-4 py-3 text-sm">{entry.city}</td>
                        <td className="px-4 py-3 text-sm">{entry.name}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          {entry.receipt > 0 ? `$${entry.receipt.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {entry.payment > 0 ? `$${entry.payment.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">{entry.details}</td>
                        <td className="px-4 py-3 text-sm text-right">${entry.prevBalance.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right">${entry.balance.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                        <FileSearch className="h-8 w-8 mx-auto mb-2" />
                        {searchTerm ? 'No entries match your search criteria' : 'No cash book entries found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Total Entries: {filteredEntries.length}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Current Balance: ${cashInHand.toFixed(2)}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CashBook;
