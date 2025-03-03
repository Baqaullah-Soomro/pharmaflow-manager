
import React, { useState } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomButton } from '@/components/ui/CustomButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { 
  FileSpreadsheet, 
  Calendar as CalendarIcon, 
  Plus, 
  Save, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

// Mock data
const accounts = [
  { id: 'AC001', title: 'ABC Pharmacy', balance: 25000 },
  { id: 'AC002', title: 'XYZ Medical Supplies', balance: 36500 },
  { id: 'AC003', title: 'Health Plus', balance: 12750 },
  { id: 'AC004', title: 'Medical Wholesale Ltd', balance: 48900 },
  { id: 'AC005', title: 'City Clinic', balance: 8300 },
];

const mockVouchers = [
  { 
    id: 'VCH001', 
    date: new Date('2023-09-15'), 
    accountId: 'AC001',
    accountTitle: 'ABC Pharmacy',
    details: 'Payment for September inventory', 
    debit: 5000, 
    credit: 0 
  },
  { 
    id: 'VCH002', 
    date: new Date('2023-09-18'), 
    accountId: 'AC002',
    accountTitle: 'XYZ Medical Supplies',
    details: 'Receipt of medical supplies', 
    debit: 0, 
    credit: 7500 
  },
  { 
    id: 'VCH003', 
    date: new Date('2023-09-20'), 
    accountId: 'AC003',
    accountTitle: 'Health Plus',
    details: 'Cash payment for outstanding balance', 
    debit: 3200, 
    credit: 0 
  },
  { 
    id: 'VCH004', 
    date: new Date('2023-09-25'), 
    accountId: 'AC004',
    accountTitle: 'Medical Wholesale Ltd',
    details: 'Purchase of surgical equipment', 
    debit: 0, 
    credit: 12500 
  },
  { 
    id: 'VCH005', 
    date: new Date('2023-09-30'), 
    accountId: 'AC005',
    accountTitle: 'City Clinic',
    details: 'Monthly pharmacy supplies', 
    debit: 4500, 
    credit: 0 
  }
];

const Voucher = () => {
  const { toast } = useToast();
  const [vouchers, setVouchers] = useState(mockVouchers);
  const [currentVoucherIndex, setCurrentVoucherIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newVoucherId, setNewVoucherId] = useState('VCH006');
  
  // Form state
  const [formData, setFormData] = useState({
    id: newVoucherId,
    date: new Date(),
    accountId: '',
    accountTitle: '',
    details: '',
    debit: 0,
    credit: 0
  });

  const [currentBalance, setCurrentBalance] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'debit' || name === 'credit') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAccountChange = (accountId: string) => {
    const selectedAccount = accounts.find(account => account.id === accountId);
    if (selectedAccount) {
      setFormData(prev => ({ 
        ...prev, 
        accountId, 
        accountTitle: selectedAccount.title 
      }));
      setCurrentBalance(selectedAccount.balance);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const resetForm = () => {
    setFormData({
      id: newVoucherId,
      date: new Date(),
      accountId: '',
      accountTitle: '',
      details: '',
      debit: 0,
      credit: 0
    });
    setCurrentBalance(0);
    setIsEditMode(false);
  };

  const handleSave = () => {
    // Validation
    if (!formData.accountId) {
      toast({
        title: "Validation Error",
        description: "Please select an account.",
        variant: "destructive"
      });
      return;
    }

    if (formData.debit === 0 && formData.credit === 0) {
      toast({
        title: "Validation Error",
        description: "Either debit or credit amount must be greater than zero.",
        variant: "destructive"
      });
      return;
    }

    if (formData.debit > 0 && formData.credit > 0) {
      toast({
        title: "Validation Error",
        description: "A voucher cannot have both debit and credit values. Please enter only one.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode) {
      // Update existing voucher
      setVouchers(prev => 
        prev.map((voucher, index) => 
          index === currentVoucherIndex ? { ...formData } : voucher
        )
      );
      
      toast({
        title: "Updated",
        description: "Voucher has been updated successfully."
      });
    } else {
      // Add new voucher
      setVouchers(prev => [...prev, { ...formData }]);
      
      // Generate next ID
      const nextId = `VCH${String(parseInt(newVoucherId.replace('VCH', '')) + 1).padStart(3, '0')}`;
      setNewVoucherId(nextId);
      
      toast({
        title: "Success",
        description: "New voucher has been created."
      });
      
      // Set the current index to the new voucher
      setCurrentVoucherIndex(vouchers.length);
    }
    
    resetForm();
    setFormData(prev => ({ ...prev, id: newVoucherId }));
  };

  const handleEdit = () => {
    const currentVoucher = vouchers[currentVoucherIndex];
    if (currentVoucher) {
      const account = accounts.find(acc => acc.id === currentVoucher.accountId);
      setFormData({ ...currentVoucher });
      setCurrentBalance(account ? account.balance : 0);
      setIsEditMode(true);
    }
  };

  const handleDelete = () => {
    if (vouchers.length > 0) {
      const updatedVouchers = vouchers.filter((_, index) => index !== currentVoucherIndex);
      setVouchers(updatedVouchers);
      
      // Adjust current index if needed
      if (currentVoucherIndex >= updatedVouchers.length) {
        setCurrentVoucherIndex(Math.max(0, updatedVouchers.length - 1));
      }
      
      toast({
        title: "Deleted",
        description: "Voucher has been deleted."
      });
      
      resetForm();
    }
  };

  const navigateVoucher = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentVoucherIndex < vouchers.length - 1) {
      setCurrentVoucherIndex(currentVoucherIndex + 1);
      loadVoucher(currentVoucherIndex + 1);
    } else if (direction === 'prev' && currentVoucherIndex > 0) {
      setCurrentVoucherIndex(currentVoucherIndex - 1);
      loadVoucher(currentVoucherIndex - 1);
    }
  };

  const loadVoucher = (index: number) => {
    const voucher = vouchers[index];
    if (voucher) {
      const account = accounts.find(acc => acc.id === voucher.accountId);
      setFormData({ ...voucher });
      setCurrentBalance(account ? account.balance : 0);
      setIsEditMode(false);
    }
  };

  // Total debit and credit
  const totalDebit = vouchers.reduce((sum, voucher) => sum + voucher.debit, 0);
  const totalCredit = vouchers.reduce((sum, voucher) => sum + voucher.credit, 0);

  return (
    <PageContainer 
      title="Voucher Management" 
      subtitle="Create and manage accounting vouchers"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              {isEditMode ? "Edit Voucher" : "Create Voucher"}
            </CardTitle>
            <CardDescription>
              Enter voucher details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Voucher No</Label>
                  <Input 
                    id="id" 
                    name="id" 
                    value={formData.id} 
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <CustomButton
                        variant="outline3D"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Select date..."}
                      </CustomButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountId">Account</Label>
                  <Select
                    value={formData.accountId}
                    onValueChange={handleAccountChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md p-3 bg-muted/50">
                  <Label className="block text-sm text-muted-foreground mb-1">Account Balance</Label>
                  <span className="text-lg font-medium">${currentBalance.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="details">Details</Label>
                  <Textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Enter transaction details"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="debit">Debit</Label>
                  <Input
                    id="debit"
                    name="debit"
                    type="number"
                    value={formData.debit === 0 ? '' : formData.debit}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="credit">Credit</Label>
                  <Input
                    id="credit"
                    name="credit"
                    type="number"
                    value={formData.credit === 0 ? '' : formData.credit}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between">
            <div className="flex gap-2 mb-4 sm:mb-0">
              <CustomButton
                variant="outline3D"
                onClick={() => navigateVoucher('prev')}
                disabled={currentVoucherIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </CustomButton>
              
              <CustomButton
                variant="outline3D"
                onClick={() => navigateVoucher('next')}
                disabled={currentVoucherIndex >= vouchers.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </CustomButton>
            </div>
            
            <div className="flex gap-2">
              <CustomButton
                variant="outline3D"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4" />
                New
              </CustomButton>
              
              <CustomButton
                variant="outline3D"
                onClick={handleEdit}
                disabled={vouchers.length === 0}
              >
                <Edit className="h-4 w-4" />
                Edit
              </CustomButton>
              
              <CustomButton
                variant="outline3D"
                onClick={handleDelete}
                disabled={vouchers.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </CustomButton>
              
              <CustomButton
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                {isEditMode ? "Update" : "Save"}
              </CustomButton>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Recent Vouchers</CardTitle>
            <CardDescription>
              Latest transaction entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.length > 0 ? (
                    vouchers.map((voucher, index) => (
                      <TableRow 
                        key={voucher.id}
                        className={index === currentVoucherIndex ? "bg-muted" : ""}
                        onClick={() => {
                          setCurrentVoucherIndex(index);
                          loadVoucher(index);
                        }}
                      >
                        <TableCell>{voucher.id}</TableCell>
                        <TableCell>{format(voucher.date, "MM/dd/yyyy")}</TableCell>
                        <TableCell>{voucher.accountTitle}</TableCell>
                        <TableCell className="text-right">{voucher.debit > 0 ? `$${voucher.debit.toLocaleString()}` : '-'}</TableCell>
                        <TableCell className="text-right">{voucher.credit > 0 ? `$${voucher.credit.toLocaleString()}` : '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No vouchers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex justify-between px-2 font-medium">
                <span>Total Debit:</span>
                <span>${totalDebit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between px-2 font-medium">
                <span>Total Credit:</span>
                <span>${totalCredit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between px-2 pt-2 border-t font-semibold">
                <span>Balance:</span>
                <span>${Math.abs(totalDebit - totalCredit).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Voucher;
