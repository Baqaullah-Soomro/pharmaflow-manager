
import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  Search, 
  DollarSign, 
  Users, 
  Calendar, 
  FileText,
  CreditCard,
  FileSearch,
  Edit,
  Trash2
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';
import { useToast } from '@/components/ui/use-toast';

// Mock data for customers
const mockCustomers = [
  { id: 1, name: 'Memorial Hospital', balance: 5000.00, city: 'New York' },
  { id: 2, name: 'City Clinic', balance: 3500.00, city: 'Chicago' },
  { id: 3, name: 'Riverside Medical Center', balance: 12000.00, city: 'Los Angeles' },
  { id: 4, name: 'Lakeside Pharmacy', balance: 2800.00, city: 'Boston' },
  { id: 5, name: 'HealthFirst Center', balance: 7500.00, city: 'Miami' },
];

// Mock data for payment methods
const paymentMethods = [
  { id: 'cash', name: 'Cash' },
  { id: 'check', name: 'Check' },
  { id: 'bank-transfer', name: 'Bank Transfer' },
  { id: 'credit-card', name: 'Credit Card' },
];

// Mock data for bank accounts
const bankAccounts = [
  { id: 1, name: 'Main Business Account', bank: 'Chase', accountNumber: 'xxxx1234' },
  { id: 2, name: 'Operations Account', bank: 'Bank of America', accountNumber: 'xxxx5678' },
  { id: 3, name: 'Payroll Account', bank: 'Wells Fargo', accountNumber: 'xxxx9012' },
];

// Mock data for collections
const mockCollections = [
  { id: 1, date: '2024-05-01', customer: 'Memorial Hospital', amount: 1200.00, method: 'Bank Transfer', reference: 'REF123456', account: 'Main Business Account', notes: 'Payment for Invoice #4567' },
  { id: 2, date: '2024-05-03', customer: 'City Clinic', amount: 850.50, method: 'Check', reference: 'CHK987123', account: 'Operations Account', notes: 'Partial payment' },
  { id: 3, date: '2024-05-05', customer: 'Riverside Medical Center', amount: 3500.00, method: 'Credit Card', reference: 'CC789012', account: 'Main Business Account', notes: 'Payment for Invoice #8901' },
  { id: 4, date: '2024-05-10', customer: 'Lakeside Pharmacy', amount: 750.25, method: 'Cash', reference: 'CASH001', account: 'Operations Account', notes: 'Payment for outstanding balance' },
];

const CashBankCollections = () => {
  const [collectionNo, setCollectionNo] = useState('COLL-2024-0001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reference, setReference] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [collections, setCollections] = useState(mockCollections);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  
  const { toast } = useToast();

  // Filter collections based on search
  const filteredCollections = collections.filter(collection => {
    const searchLower = searchTerm.toLowerCase();
    return (
      collection.customer.toLowerCase().includes(searchLower) ||
      collection.reference.toLowerCase().includes(searchLower) ||
      collection.method.toLowerCase().includes(searchLower)
    );
  });

  // Filter customers based on search
  const filteredCustomers = mockCustomers.filter(customer => {
    return customer.name.toLowerCase().includes(customerSearch.toLowerCase());
  });

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
  };

  const handleSave = () => {
    if (!selectedCustomer || !amount || !paymentMethod || !selectedAccount) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingCollection) {
      // Update existing collection
      const updatedCollections = collections.map(collection => {
        if (collection.id === editingCollection.id) {
          return {
            ...collection,
            date,
            customer: selectedCustomer.name,
            amount: amountValue,
            method: paymentMethod,
            reference,
            account: selectedAccount,
            notes
          };
        }
        return collection;
      });
      
      setCollections(updatedCollections);
      toast({
        title: "Collection Updated",
        description: "Collection record has been updated successfully."
      });
    } else {
      // Add new collection
      const newCollection = {
        id: collections.length > 0 ? Math.max(...collections.map(c => c.id)) + 1 : 1,
        date,
        customer: selectedCustomer.name,
        amount: amountValue,
        method: paymentMethod,
        reference,
        account: selectedAccount,
        notes
      };
      
      setCollections([...collections, newCollection]);
      toast({
        title: "Collection Added",
        description: "New collection record has been added successfully."
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setCustomerSearch('');
    setAmount('');
    setPaymentMethod('');
    setReference('');
    setSelectedAccount('');
    setNotes('');
    setEditingCollection(null);
    setCollectionNo(`COLL-2024-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleEdit = (collection: any) => {
    const customer = mockCustomers.find(c => c.name === collection.customer);
    setSelectedCustomer(customer);
    setCustomerSearch(collection.customer);
    setDate(collection.date);
    setAmount(collection.amount.toString());
    setPaymentMethod(collection.method);
    setReference(collection.reference);
    setSelectedAccount(collection.account);
    setNotes(collection.notes);
    setEditingCollection(collection);
  };

  const handleDelete = (id: number) => {
    setCollections(collections.filter(collection => collection.id !== id));
    toast({
      title: "Collection Deleted",
      description: "Collection record has been deleted successfully.",
      variant: "destructive"
    });
  };

  return (
    <PageContainer 
      title="Cash & Bank Collections" 
      subtitle="Record and manage incoming payments from customers"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Collection Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{editingCollection ? 'Edit Collection' : 'New Collection'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="collectionNo" className="block text-sm font-medium mb-1">Collection No</label>
                <input
                  id="collectionNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={collectionNo}
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
                <label htmlFor="customer" className="block text-sm font-medium mb-1">Customer</label>
                <div className="relative">
                  <input
                    id="customer"
                    type="text"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    placeholder="Search customer..."
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                      setSelectedCustomer(null);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                  />
                  {showCustomerDropdown && customerSearch && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(customer => (
                          <div
                            key={customer.id}
                            className="p-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSelectCustomer(customer)}
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.city} | Balance: ${customer.balance.toFixed(2)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-muted-foreground">No customers found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {selectedCustomer && (
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm">
                    <span className="font-medium">Current Balance:</span> ${selectedCustomer.balance.toFixed(2)}
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  id="paymentMethod"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.name}>{method.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="reference" className="block text-sm font-medium mb-1">Reference No</label>
                <input
                  id="reference"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Check No., Transaction ID, etc."
                />
              </div>
              
              <div>
                <label htmlFor="account" className="block text-sm font-medium mb-1">Deposit Account</label>
                <select
                  id="account"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                >
                  <option value="">Select Account</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.name}>
                      {account.name} ({account.bank})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  id="notes"
                  className="w-full p-2 rounded-md border border-input bg-background min-h-[80px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional information..."
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {editingCollection ? 'Update Collection' : 'Save Collection'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Collections List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Collection Records</CardTitle>
              <SearchInput 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search collections..."
                className="w-64"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Method</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reference</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Account</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollections.length > 0 ? (
                    filteredCollections.map((collection, index) => (
                      <tr 
                        key={collection.id} 
                        className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {collection.date}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            {collection.customer}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                          ${collection.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                            {collection.method}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{collection.reference}</td>
                        <td className="px-4 py-3 text-sm">{collection.account}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(collection)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(collection.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        <FileSearch className="h-8 w-8 mx-auto mb-2" />
                        {searchTerm ? 'No collections match your search criteria' : 'No collection records found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Total Records: {filteredCollections.length}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Total Collected: $
                {filteredCollections.reduce((sum, record) => sum + record.amount, 0).toFixed(2)}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CashBankCollections;
