
import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  Printer, 
  Calendar, 
  User,
  Building,
  CreditCard,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import { useToast } from '@/components/ui/use-toast';

// Mock data for customers
const mockCustomers = [
  { id: 1, name: 'Memorial Hospital', city: 'Lahore', balance: 15000 },
  { id: 2, name: 'City Clinic', city: 'Karachi', balance: 8500 },
  { id: 3, name: 'Riverside Medical Center', city: 'Islamabad', balance: 23000 },
  { id: 4, name: 'Lakeside Pharmacy', city: 'Rawalpindi', balance: 7200 },
];

// Mock data for existing collections
const mockCollections = [
  { id: 1, date: '2024-04-01', receiptNo: 'RCP-2024-001', customer: 'Memorial Hospital', amount: 5000, paymentMethod: 'Bank Transfer', bank: 'HBL', chequeNo: 'CHK-10053', remarks: 'Payment for Invoice #1001' },
  { id: 2, date: '2024-04-05', receiptNo: 'RCP-2024-002', customer: 'City Clinic', amount: 3500, paymentMethod: 'Cheque', bank: 'UBL', chequeNo: 'CHK-22781', remarks: 'Partial payment for Invoice #1002' },
  { id: 3, date: '2024-04-10', receiptNo: 'RCP-2024-003', customer: 'Riverside Medical Center', amount: 8000, paymentMethod: 'Online Transfer', bank: 'MCB', chequeNo: '', remarks: 'Full payment for Invoice #1003' },
];

// Payment method options
const paymentMethods = ['Cash', 'Cheque', 'Bank Transfer', 'Online Transfer', 'Credit Card'];
const banks = ['HBL', 'UBL', 'MCB', 'Allied Bank', 'Bank Alfalah', 'Standard Chartered', 'Other'];

const CashBankCollections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collections, setCollections] = useState(mockCollections);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentCollection, setCurrentCollection] = useState({
    id: 0,
    date: new Date().toISOString().split('T')[0],
    receiptNo: `RCP-2024-${String(collections.length + 1).padStart(3, '0')}`,
    customer: '',
    amount: 0,
    paymentMethod: 'Cash',
    bank: '',
    chequeNo: '',
    remarks: ''
  });
  
  const { toast } = useToast();

  // Filter collections based on search
  const filteredCollections = collections.filter(collection => {
    const searchLower = searchTerm.toLowerCase();
    return (
      collection.customer.toLowerCase().includes(searchLower) ||
      collection.receiptNo.toLowerCase().includes(searchLower)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCollection(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setCurrentCollection({
      id: 0,
      date: new Date().toISOString().split('T')[0],
      receiptNo: `RCP-2024-${String(collections.length + 1).padStart(3, '0')}`,
      customer: '',
      amount: 0,
      paymentMethod: 'Cash',
      bank: '',
      chequeNo: '',
      remarks: ''
    });
    setFormMode('add');
  };

  const handleSelectCustomer = (customer: any) => {
    setCurrentCollection(prev => ({
      ...prev,
      customer: customer.name
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentCollection.customer === '' || currentCollection.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please select a customer and enter a valid amount.",
        variant: "destructive"
      });
      return;
    }
    
    if (formMode === 'add') {
      // Add new collection
      const newCollection = {
        ...currentCollection,
        id: collections.length > 0 ? Math.max(...collections.map(c => c.id)) + 1 : 1
      };
      
      setCollections([...collections, newCollection]);
      toast({
        title: "Collection Added",
        description: `Collection receipt ${newCollection.receiptNo} has been added.`,
      });
    } else {
      // Update existing collection
      setCollections(collections.map(c => c.id === currentCollection.id ? currentCollection : c));
      toast({
        title: "Collection Updated",
        description: `Collection receipt ${currentCollection.receiptNo} has been updated.`,
      });
    }
    
    resetForm();
  };

  const handleEdit = (collection: any) => {
    setCurrentCollection(collection);
    setFormMode('edit');
  };

  const handleDelete = (id: number) => {
    setCollections(collections.filter(c => c.id !== id));
    toast({
      title: "Collection Deleted",
      description: "The collection receipt has been deleted.",
      variant: "destructive"
    });
  };

  const printReceipt = () => {
    toast({
      title: "Printing Receipt",
      description: "The receipt is being sent to the printer.",
    });
    // In a real application, this would trigger printing functionality
  };

  return (
    <PageContainer 
      title="Cash & Bank Collections" 
      subtitle="Manage customer payments and collections"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Collection Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{formMode === 'add' ? 'New Collection' : 'Edit Collection'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={currentCollection.date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="receiptNo" className="block text-sm font-medium mb-1">Receipt No</label>
                <input
                  id="receiptNo"
                  name="receiptNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentCollection.receiptNo}
                  onChange={handleInputChange}
                  readOnly={formMode === 'edit'}
                />
              </div>
              
              <div>
                <label htmlFor="customer" className="block text-sm font-medium mb-1">Customer</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="customer"
                    name="customer"
                    type="text"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={currentCollection.customer}
                    onChange={handleInputChange}
                    placeholder="Select or enter customer name"
                  />
                  {currentCollection.customer === '' && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                      {mockCustomers.map(customer => (
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={currentCollection.amount}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentCollection.paymentMethod}
                  onChange={handleInputChange}
                >
                  {paymentMethods.map((method, index) => (
                    <option key={index} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              {currentCollection.paymentMethod !== 'Cash' && (
                <>
                  <div>
                    <label htmlFor="bank" className="block text-sm font-medium mb-1">Bank</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <select
                        id="bank"
                        name="bank"
                        className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                        value={currentCollection.bank}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Bank</option>
                        {banks.map((bank, index) => (
                          <option key={index} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {currentCollection.paymentMethod === 'Cheque' && (
                    <div>
                      <label htmlFor="chequeNo" className="block text-sm font-medium mb-1">Cheque No</label>
                      <input
                        id="chequeNo"
                        name="chequeNo"
                        type="text"
                        className="w-full p-2 rounded-md border border-input bg-background"
                        value={currentCollection.chequeNo}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </>
              )}
              
              <div>
                <label htmlFor="remarks" className="block text-sm font-medium mb-1">Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  rows={2}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentCollection.remarks}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  {formMode === 'add' ? (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Collection
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Collection
                    </>
                  )}
                </Button>
                
                {formMode === 'edit' && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Collections List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Collection History</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search collections..."
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background ring-offset-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <CustomButton variant="premium" size="sm" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </CustomButton>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Receipt No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Payment Method</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollections.map((collection, index) => (
                    <tr 
                      key={collection.id} 
                      className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm">{collection.date}</td>
                      <td className="px-4 py-3 text-sm">{collection.receiptNo}</td>
                      <td className="px-4 py-3 text-sm">{collection.customer}</td>
                      <td className="px-4 py-3 text-sm text-right">${collection.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{collection.paymentMethod}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center justify-center space-x-2">
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
                            onClick={() => printReceipt()}
                          >
                            <Printer className="h-4 w-4" />
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
                  ))}
                  {filteredCollections.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        {searchTerm ? 'No collections match your search criteria' : 'No collections have been added yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CashBankCollections;
