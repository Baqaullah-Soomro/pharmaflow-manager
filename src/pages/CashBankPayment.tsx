
import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  Search, 
  DollarSign, 
  Building, 
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

// Mock data for suppliers
const mockSuppliers = [
  { id: 1, name: 'MediSuppliers Ltd', balance: 8500.00, city: 'Dallas' },
  { id: 2, name: 'Lab Equipment Co.', balance: 4300.00, city: 'Boston' },
  { id: 3, name: 'PharmaDirect', balance: 12750.00, city: 'Chicago' },
  { id: 4, name: 'MedTech Systems', balance: 6800.00, city: 'Los Angeles' },
  { id: 5, name: 'Health Essentials', balance: 3200.00, city: 'New York' },
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

// Mock data for payment categories
const paymentCategories = [
  { id: 'inventory', name: 'Inventory Purchase' },
  { id: 'equipment', name: 'Equipment Purchase' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'rent', name: 'Rent' },
  { id: 'salaries', name: 'Salaries' },
  { id: 'taxes', name: 'Taxes' },
  { id: 'other', name: 'Other Expenses' },
];

// Mock data for payments
const mockPayments = [
  { id: 1, date: '2024-05-02', supplier: 'MediSuppliers Ltd', amount: 3500.00, method: 'Bank Transfer', reference: 'TRF987654', account: 'Main Business Account', category: 'Inventory Purchase', notes: 'Payment for Invoice #7890' },
  { id: 2, date: '2024-05-04', supplier: 'Lab Equipment Co.', amount: 1200.50, method: 'Check', reference: 'CHK456789', account: 'Operations Account', category: 'Equipment Purchase', notes: 'New lab equipment' },
  { id: 3, date: '2024-05-08', supplier: 'PharmaDirect', amount: 4750.00, method: 'Bank Transfer', reference: 'TRF123789', account: 'Main Business Account', category: 'Inventory Purchase', notes: 'Payment for Invoice #3456' },
  { id: 4, date: '2024-05-12', supplier: 'MedTech Systems', amount: 2250.75, method: 'Credit Card', reference: 'CC789456', account: 'Operations Account', category: 'Equipment Purchase', notes: 'New diagnostic equipment' },
];

const CashBankPayment = () => {
  const [paymentNo, setPaymentNo] = useState('PAY-2024-0001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reference, setReference] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState(mockPayments);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  
  const { toast } = useToast();

  // Filter payments based on search
  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.supplier.toLowerCase().includes(searchLower) ||
      payment.reference.toLowerCase().includes(searchLower) ||
      payment.method.toLowerCase().includes(searchLower) ||
      payment.category.toLowerCase().includes(searchLower)
    );
  });

  // Filter suppliers based on search
  const filteredSuppliers = mockSuppliers.filter(supplier => {
    return supplier.name.toLowerCase().includes(supplierSearch.toLowerCase());
  });

  const handleSelectSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setSupplierSearch(supplier.name);
    setShowSupplierDropdown(false);
  };

  const handleSave = () => {
    if (!selectedSupplier || !amount || !paymentMethod || !selectedAccount || !selectedCategory) {
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
    
    if (editingPayment) {
      // Update existing payment
      const updatedPayments = payments.map(payment => {
        if (payment.id === editingPayment.id) {
          return {
            ...payment,
            date,
            supplier: selectedSupplier.name,
            amount: amountValue,
            method: paymentMethod,
            reference,
            account: selectedAccount,
            category: selectedCategory,
            notes
          };
        }
        return payment;
      });
      
      setPayments(updatedPayments);
      toast({
        title: "Payment Updated",
        description: "Payment record has been updated successfully."
      });
    } else {
      // Add new payment
      const newPayment = {
        id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
        date,
        supplier: selectedSupplier.name,
        amount: amountValue,
        method: paymentMethod,
        reference,
        account: selectedAccount,
        category: selectedCategory,
        notes
      };
      
      setPayments([...payments, newPayment]);
      toast({
        title: "Payment Added",
        description: "New payment record has been added successfully."
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setSelectedSupplier(null);
    setSupplierSearch('');
    setAmount('');
    setPaymentMethod('');
    setReference('');
    setSelectedAccount('');
    setSelectedCategory('');
    setNotes('');
    setEditingPayment(null);
    setPaymentNo(`PAY-2024-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleEdit = (payment: any) => {
    const supplier = mockSuppliers.find(s => s.name === payment.supplier);
    setSelectedSupplier(supplier);
    setSupplierSearch(payment.supplier);
    setDate(payment.date);
    setAmount(payment.amount.toString());
    setPaymentMethod(payment.method);
    setReference(payment.reference);
    setSelectedAccount(payment.account);
    setSelectedCategory(payment.category);
    setNotes(payment.notes);
    setEditingPayment(payment);
  };

  const handleDelete = (id: number) => {
    setPayments(payments.filter(payment => payment.id !== id));
    toast({
      title: "Payment Deleted",
      description: "Payment record has been deleted successfully.",
      variant: "destructive"
    });
  };

  return (
    <PageContainer 
      title="Cash & Bank Payment" 
      subtitle="Record and manage outgoing payments to suppliers and vendors"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Payment Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{editingPayment ? 'Edit Payment' : 'New Payment'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="paymentNo" className="block text-sm font-medium mb-1">Payment No</label>
                <input
                  id="paymentNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={paymentNo}
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
                <label htmlFor="supplier" className="block text-sm font-medium mb-1">Supplier</label>
                <div className="relative">
                  <input
                    id="supplier"
                    type="text"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    placeholder="Search supplier..."
                    value={supplierSearch}
                    onChange={(e) => {
                      setSupplierSearch(e.target.value);
                      setShowSupplierDropdown(true);
                      setSelectedSupplier(null);
                    }}
                    onFocus={() => setShowSupplierDropdown(true)}
                  />
                  {showSupplierDropdown && supplierSearch && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map(supplier => (
                          <div
                            key={supplier.id}
                            className="p-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSelectSupplier(supplier)}
                          >
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {supplier.city} | Balance: ${supplier.balance.toFixed(2)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-muted-foreground">No suppliers found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {selectedSupplier && (
                <div className="p-3 bg-muted rounded-md">
                  <div className="text-sm">
                    <span className="font-medium">Current Balance:</span> ${selectedSupplier.balance.toFixed(2)}
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
                <label htmlFor="account" className="block text-sm font-medium mb-1">From Account</label>
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
                <label htmlFor="category" className="block text-sm font-medium mb-1">Payment Category</label>
                <select
                  id="category"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {paymentCategories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
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
                  {editingPayment ? 'Update Payment' : 'Save Payment'}
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
        
        {/* Payments List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payment Records</CardTitle>
              <SearchInput 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search payments..."
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Supplier</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Method</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Account</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment, index) => (
                      <tr 
                        key={payment.id} 
                        className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {payment.date}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            {payment.supplier}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                            {payment.method}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{payment.category}</td>
                        <td className="px-4 py-3 text-sm">{payment.account}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(payment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(payment.id)}
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
                        {searchTerm ? 'No payments match your search criteria' : 'No payment records found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Total Records: {filteredPayments.length}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Total Paid: $
                {filteredPayments.reduce((sum, record) => sum + record.amount, 0).toFixed(2)}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CashBankPayment;
