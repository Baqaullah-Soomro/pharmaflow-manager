
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
  Search,
  FileText
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import { useToast } from '@/components/ui/use-toast';

// Mock data for suppliers
const mockSuppliers = [
  { id: 1, name: 'MediTech Suppliers', city: 'Lahore', balance: 25000 },
  { id: 2, name: 'PharmaPlus Distribution', city: 'Karachi', balance: 18500 },
  { id: 3, name: 'HealthFirst Wholesale', city: 'Islamabad', balance: 32000 },
  { id: 4, name: 'CleanMed Products', city: 'Rawalpindi', balance: 12200 },
];

// Mock data for existing payments
const mockPayments = [
  { id: 1, date: '2024-04-02', voucherNo: 'PMT-2024-001', supplier: 'MediTech Suppliers', amount: 8000, paymentMethod: 'Bank Transfer', bank: 'HBL', chequeNo: '', remarks: 'Payment for Invoice #S1001' },
  { id: 2, date: '2024-04-07', voucherNo: 'PMT-2024-002', supplier: 'PharmaPlus Distribution', amount: 5500, paymentMethod: 'Cheque', bank: 'UBL', chequeNo: 'CHK-54781', remarks: 'Partial payment for Invoice #S1002' },
  { id: 3, date: '2024-04-12', voucherNo: 'PMT-2024-003', supplier: 'HealthFirst Wholesale', amount: 12000, paymentMethod: 'Online Transfer', bank: 'MCB', chequeNo: '', remarks: 'Full payment for Invoice #S1003' },
];

// Payment method options
const paymentMethods = ['Cash', 'Cheque', 'Bank Transfer', 'Online Transfer', 'Credit Card'];
const banks = ['HBL', 'UBL', 'MCB', 'Allied Bank', 'Bank Alfalah', 'Standard Chartered', 'Other'];
const expenseCategories = ['Inventory Purchase', 'Utilities', 'Rent', 'Salaries', 'Transportation', 'Marketing', 'Miscellaneous'];

const CashBankPayment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState(mockPayments);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentPayment, setCurrentPayment] = useState({
    id: 0,
    date: new Date().toISOString().split('T')[0],
    voucherNo: `PMT-2024-${String(payments.length + 1).padStart(3, '0')}`,
    supplier: '',
    amount: 0,
    paymentMethod: 'Cash',
    bank: '',
    chequeNo: '',
    category: 'Inventory Purchase',
    remarks: ''
  });
  
  const { toast } = useToast();

  // Filter payments based on search
  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.supplier.toLowerCase().includes(searchLower) ||
      payment.voucherNo.toLowerCase().includes(searchLower)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentPayment(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setCurrentPayment({
      id: 0,
      date: new Date().toISOString().split('T')[0],
      voucherNo: `PMT-2024-${String(payments.length + 1).padStart(3, '0')}`,
      supplier: '',
      amount: 0,
      paymentMethod: 'Cash',
      bank: '',
      chequeNo: '',
      category: 'Inventory Purchase',
      remarks: ''
    });
    setFormMode('add');
  };

  const handleSelectSupplier = (supplier: any) => {
    setCurrentPayment(prev => ({
      ...prev,
      supplier: supplier.name
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPayment.supplier === '' || currentPayment.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please select a supplier and enter a valid amount.",
        variant: "destructive"
      });
      return;
    }
    
    if (formMode === 'add') {
      // Add new payment
      const newPayment = {
        ...currentPayment,
        id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1
      };
      
      setPayments([...payments, newPayment]);
      toast({
        title: "Payment Added",
        description: `Payment voucher ${newPayment.voucherNo} has been added.`,
      });
    } else {
      // Update existing payment
      setPayments(payments.map(p => p.id === currentPayment.id ? currentPayment : p));
      toast({
        title: "Payment Updated",
        description: `Payment voucher ${currentPayment.voucherNo} has been updated.`,
      });
    }
    
    resetForm();
  };

  const handleEdit = (payment: any) => {
    setCurrentPayment(payment);
    setFormMode('edit');
  };

  const handleDelete = (id: number) => {
    setPayments(payments.filter(p => p.id !== id));
    toast({
      title: "Payment Deleted",
      description: "The payment voucher has been deleted.",
      variant: "destructive"
    });
  };

  const printVoucher = () => {
    toast({
      title: "Printing Voucher",
      description: "The payment voucher is being sent to the printer.",
    });
    // In a real application, this would trigger printing functionality
  };

  return (
    <PageContainer 
      title="Cash & Bank Payment" 
      subtitle="Manage supplier and expense payments"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Payment Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{formMode === 'add' ? 'New Payment' : 'Edit Payment'}</CardTitle>
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
                    value={currentPayment.date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="voucherNo" className="block text-sm font-medium mb-1">Voucher No</label>
                <input
                  id="voucherNo"
                  name="voucherNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentPayment.voucherNo}
                  onChange={handleInputChange}
                  readOnly={formMode === 'edit'}
                />
              </div>
              
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium mb-1">Supplier/Payee</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="supplier"
                    name="supplier"
                    type="text"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={currentPayment.supplier}
                    onChange={handleInputChange}
                    placeholder="Select or enter supplier name"
                  />
                  {currentPayment.supplier === '' && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                      {mockSuppliers.map(supplier => (
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Expense Category</label>
                <select
                  id="category"
                  name="category"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentPayment.category}
                  onChange={handleInputChange}
                >
                  {expenseCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
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
                    value={currentPayment.amount}
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
                  value={currentPayment.paymentMethod}
                  onChange={handleInputChange}
                >
                  {paymentMethods.map((method, index) => (
                    <option key={index} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              {currentPayment.paymentMethod !== 'Cash' && (
                <>
                  <div>
                    <label htmlFor="bank" className="block text-sm font-medium mb-1">Bank</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <select
                        id="bank"
                        name="bank"
                        className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                        value={currentPayment.bank}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Bank</option>
                        {banks.map((bank, index) => (
                          <option key={index} value={bank}>{bank}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {currentPayment.paymentMethod === 'Cheque' && (
                    <div>
                      <label htmlFor="chequeNo" className="block text-sm font-medium mb-1">Cheque No</label>
                      <input
                        id="chequeNo"
                        name="chequeNo"
                        type="text"
                        className="w-full p-2 rounded-md border border-input bg-background"
                        value={currentPayment.chequeNo}
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
                  value={currentPayment.remarks}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  {formMode === 'add' ? (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Payment
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
        
        {/* Payments List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payment History</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search payments..."
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Voucher No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Supplier/Payee</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Payment Method</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <tr 
                      key={payment.id} 
                      className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm">{payment.date}</td>
                      <td className="px-4 py-3 text-sm">{payment.voucherNo}</td>
                      <td className="px-4 py-3 text-sm">{payment.supplier}</td>
                      <td className="px-4 py-3 text-sm text-right">${payment.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{payment.paymentMethod}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center justify-center space-x-2">
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
                            onClick={() => printVoucher()}
                          >
                            <Printer className="h-4 w-4" />
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
                  ))}
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2" />
                        {searchTerm ? 'No payments match your search criteria' : 'No payments have been added yet'}
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

export default CashBankPayment;
