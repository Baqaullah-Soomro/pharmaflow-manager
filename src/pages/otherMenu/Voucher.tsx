
import React, { useState } from 'react';
import { FileText, Save, Edit, Trash, ArrowLeft, ArrowRight, Plus, DollarSign } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import { toast } from "@/hooks/use-toast";

// Mock account data for dropdown
const mockAccounts = [
  { id: 'ACC001', title: 'City Hospital' },
  { id: 'ACC002', title: 'Metro Pharmacy' },
  { id: 'ACC003', title: 'MediSupply Co' },
  { id: 'ACC004', title: 'Sunrise Clinic' },
  { id: 'ACC005', title: 'Healthcare Solutions' },
  { id: 'Cash', title: 'Cash Account' },
  { id: 'Bank', title: 'Bank Account' },
];

// Mock voucher data
const mockVouchers = [
  { id: 'V001', date: '2023-04-15', accountId: 'ACC001', accountTitle: 'City Hospital', details: 'Payment for medical supplies', debit: 5000, credit: 0 },
  { id: 'V002', date: '2023-04-16', accountId: 'ACC002', accountTitle: 'Metro Pharmacy', details: 'Receipt for medicine delivery', debit: 0, credit: 3500 },
  { id: 'V003', date: '2023-04-17', accountId: 'Cash', accountTitle: 'Cash Account', details: 'Petty cash withdrawal', debit: 1000, credit: 0 },
  { id: 'V004', date: '2023-04-18', accountId: 'ACC003', accountTitle: 'MediSupply Co', details: 'Invoice payment', debit: 0, credit: 7800 },
];

const Voucher = () => {
  const [vouchers, setVouchers] = useState(mockVouchers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVoucher = vouchers[currentIndex];
  
  // Form state
  const [voucherNo, setVoucherNo] = useState('V001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');
  const [details, setDetails] = useState('');
  const [debit, setDebit] = useState('');
  const [credit, setCredit] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Calculate balances
  const accountBalance = 25000; // This would typically be fetched from an API
  const totalDebit = vouchers.reduce((sum, v) => sum + v.debit, 0);
  const totalCredit = vouchers.reduce((sum, v) => sum + v.credit, 0);
  
  const handleNew = () => {
    // Generate new voucher number
    const newVoucherNo = `V${String(vouchers.length + 1).padStart(3, '0')}`;
    setVoucherNo(newVoucherNo);
    setDate(new Date().toISOString().split('T')[0]);
    setAccountId('');
    setDetails('');
    setDebit('');
    setCredit('');
    setIsEditing(false);
  };
  
  const handleSave = () => {
    if (!accountId || !date || !details || (!debit && !credit)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (debit && credit) {
      toast({
        title: "Error",
        description: "A voucher cannot have both debit and credit amounts.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedAccount = mockAccounts.find(acc => acc.id === accountId);
    
    const newVoucher = {
      id: voucherNo,
      date,
      accountId,
      accountTitle: selectedAccount?.title || '',
      details,
      debit: debit ? parseFloat(debit) : 0,
      credit: credit ? parseFloat(credit) : 0
    };
    
    if (isEditing) {
      // Update existing voucher
      const updatedVouchers = [...vouchers];
      updatedVouchers[currentIndex] = newVoucher;
      setVouchers(updatedVouchers);
      toast({
        title: "Success",
        description: "Voucher updated successfully.",
      });
    } else {
      // Add new voucher
      setVouchers([...vouchers, newVoucher]);
      setCurrentIndex(vouchers.length);
      toast({
        title: "Success",
        description: "New voucher created successfully.",
      });
    }
    
    handleNew();
  };
  
  const handleEdit = () => {
    if (!currentVoucher) return;
    
    setVoucherNo(currentVoucher.id);
    setDate(currentVoucher.date);
    setAccountId(currentVoucher.accountId);
    setDetails(currentVoucher.details);
    setDebit(currentVoucher.debit ? currentVoucher.debit.toString() : '');
    setCredit(currentVoucher.credit ? currentVoucher.credit.toString() : '');
    setIsEditing(true);
  };
  
  const handleDelete = () => {
    if (!currentVoucher) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this voucher?');
    if (!confirmDelete) return;
    
    const newVouchers = vouchers.filter((_, index) => index !== currentIndex);
    setVouchers(newVouchers);
    
    if (currentIndex >= newVouchers.length && newVouchers.length > 0) {
      setCurrentIndex(newVouchers.length - 1);
    } else if (newVouchers.length === 0) {
      handleNew();
    }
    
    toast({
      title: "Success",
      description: "Voucher deleted successfully.",
    });
  };
  
  const handleNext = () => {
    if (currentIndex < vouchers.length - 1) {
      setCurrentIndex(currentIndex + 1);
      handleLoadVoucher(currentIndex + 1);
    }
  };
  
  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      handleLoadVoucher(currentIndex - 1);
    }
  };
  
  const handleLoadVoucher = (index: number) => {
    const voucher = vouchers[index];
    if (!voucher) return;
    
    setVoucherNo(voucher.id);
    setDate(voucher.date);
    setAccountId(voucher.accountId);
    setDetails(voucher.details);
    setDebit(voucher.debit ? voucher.debit.toString() : '');
    setCredit(voucher.credit ? voucher.credit.toString() : '');
    setIsEditing(true);
  };
  
  return (
    <PageContainer 
      title="Voucher" 
      subtitle="Create and manage vouchers for financial transactions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Voucher' : 'New Voucher'}</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Update voucher information' 
                : 'Fill in the details to create a new voucher'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="voucherNo" className="block text-sm font-medium mb-1">Voucher No</label>
                <input
                  id="voucherNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-muted"
                  value={voucherNo}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date *</label>
                <input
                  id="date"
                  type="date"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="account" className="block text-sm font-medium mb-1">Title of Account *</label>
              <select
                id="account"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
              >
                <option value="">-- Select Account --</option>
                {mockAccounts.map((account) => (
                  <option key={account.id} value={account.id}>{account.title}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="details" className="block text-sm font-medium mb-1">Details *</label>
              <textarea
                id="details"
                className="w-full p-2 rounded-md border border-input bg-background min-h-[100px]"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="debit" className="block text-sm font-medium mb-1">Debit</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="debit"
                    type="number"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={debit}
                    onChange={(e) => {
                      setDebit(e.target.value);
                      if (e.target.value) setCredit('');
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="credit" className="block text-sm font-medium mb-1">Credit</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="credit"
                    type="number"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={credit}
                    onChange={(e) => {
                      setCredit(e.target.value);
                      if (e.target.value) setDebit('');
                    }}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <CustomButton 
                onClick={handleNew} 
                variant="outline3D"
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </CustomButton>
              
              <CustomButton 
                onClick={handleSave} 
                variant="premium"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update' : 'Save'}
              </CustomButton>
              
              <CustomButton 
                onClick={handleEdit} 
                variant="outline3D"
                disabled={!currentVoucher}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </CustomButton>
              
              <CustomButton 
                onClick={handleDelete} 
                variant="outline3D"
                className="text-destructive hover:text-destructive"
                disabled={!currentVoucher || vouchers.length === 0}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </CustomButton>
              
              <CustomButton 
                onClick={handleBack} 
                variant="outline3D"
                disabled={currentIndex === 0 || vouchers.length === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </CustomButton>
              
              <CustomButton 
                onClick={handleNext} 
                variant="outline3D"
                disabled={currentIndex >= vouchers.length - 1 || vouchers.length === 0}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Next
              </CustomButton>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Financial summary for selected account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/10">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Account Balance:</span>
                <span className="font-bold">${accountBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Total Debit:</span>
                <span className="font-bold text-red-500">${totalDebit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Credit:</span>
                <span className="font-bold text-green-500">${totalCredit.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="rounded-md border">
              <div className="bg-muted/50 px-4 py-2 font-medium">Recent Vouchers</div>
              <div className="divide-y">
                {vouchers.slice(-5).map((voucher, index) => (
                  <div key={voucher.id} className="p-3 hover:bg-muted/10 cursor-pointer" onClick={() => handleLoadVoucher(vouchers.indexOf(voucher))}>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{voucher.id}</span>
                      <span>{voucher.date}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1 truncate">{voucher.accountTitle}</div>
                    <div className="text-sm text-muted-foreground mb-2 truncate">{voucher.details}</div>
                    <div className="flex justify-between">
                      {voucher.debit > 0 && (
                        <span className="text-red-500 font-medium">Dr: ${voucher.debit.toLocaleString()}</span>
                      )}
                      {voucher.credit > 0 && (
                        <span className="text-green-500 font-medium">Cr: ${voucher.credit.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {vouchers.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No vouchers found
                  </div>
                )}
              </div>
            </div>
            
            <CustomButton 
              variant="outline3D"
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              View All Vouchers
            </CustomButton>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Voucher;
