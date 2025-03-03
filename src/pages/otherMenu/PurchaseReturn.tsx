
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
  RefreshCw, 
  Calendar as CalendarIcon, 
  Search, 
  Plus, 
  Save, 
  Edit, 
  Trash2, 
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import SearchInput from '@/components/ui/SearchInput';

// Mock data
const accounts = [
  { id: 'SUP001', title: 'ABC Pharma', balance: 25000 },
  { id: 'SUP002', title: 'MedTech Labs', balance: 36500 },
  { id: 'SUP003', title: 'Healthcare Solutions', balance: 12750 },
  { id: 'SUP004', title: 'Vital Meds Inc.', balance: 48900 },
  { id: 'SUP005', title: 'PharmaCare', balance: 8300 },
];

const companies = ['ABC Pharma', 'MedTech Labs', 'Healthcare Solutions', 'Vital Meds Inc.', 'PharmaCare'];

const items = [
  { code: 'ITEM001', name: 'Paracetamol', company: 'ABC Pharma', packing: '10x10', price: 12.50 },
  { code: 'ITEM002', name: 'Amoxicillin', company: 'MedTech Labs', packing: '5x10', price: 25.75 },
  { code: 'ITEM003', name: 'Ibuprofen', company: 'Healthcare Solutions', packing: '10x10', price: 15.20 },
  { code: 'ITEM004', name: 'Aspirin', company: 'Vital Meds Inc.', packing: '10x15', price: 10.80 },
  { code: 'ITEM005', name: 'Diclofenac', company: 'PharmaCare', packing: '5x10', price: 18.90 },
  { code: 'ITEM006', name: 'Metformin', company: 'ABC Pharma', packing: '10x10', price: 22.40 },
  { code: 'ITEM007', name: 'Atorvastatin', company: 'MedTech Labs', packing: '3x10', price: 45.60 },
  { code: 'ITEM008', name: 'Omeprazole', company: 'Healthcare Solutions', packing: '2x10', price: 30.25 },
  { code: 'ITEM009', name: 'Losartan', company: 'Vital Meds Inc.', packing: '3x10', price: 28.70 },
  { code: 'ITEM010', name: 'Amlodipine', company: 'PharmaCare', packing: '5x10', price: 20.15 },
];

// Purchase invoices
const purchaseInvoices = [
  { id: 'PUR001', date: new Date('2023-09-15'), supplier: 'SUP001', items: [
    { ...items[0], quantity: 200, bonus: 20 },
    { ...items[5], quantity: 150, bonus: 15 },
  ]},
  { id: 'PUR002', date: new Date('2023-09-18'), supplier: 'SUP002', items: [
    { ...items[1], quantity: 180, bonus: 18 },
    { ...items[6], quantity: 120, bonus: 12 },
  ]},
  { id: 'PUR003', date: new Date('2023-09-20'), supplier: 'SUP003', items: [
    { ...items[2], quantity: 220, bonus: 22 },
    { ...items[7], quantity: 100, bonus: 10 },
  ]},
  { id: 'PUR004', date: new Date('2023-09-25'), supplier: 'SUP004', items: [
    { ...items[3], quantity: 250, bonus: 25 },
    { ...items[8], quantity: 130, bonus: 13 },
  ]},
  { id: 'PUR005', date: new Date('2023-09-30'), supplier: 'SUP005', items: [
    { ...items[4], quantity: 190, bonus: 19 },
    { ...items[9], quantity: 140, bonus: 14 },
  ]},
];

const PurchaseReturn = () => {
  const { toast } = useToast();
  const [returnId, setReturnId] = useState('RET001');
  const [date, setDate] = useState<Date>(new Date());
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] = useState('');
  const [biltyNo, setBiltyNo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [returnItems, setReturnItems] = useState<any[]>([]);
  
  // Financial calculations
  const [discount, setDiscount] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setPreviousBalance(account.balance);
    } else {
      setPreviousBalance(0);
    }
  };

  const handlePurchaseInvoiceChange = (invoiceId: string) => {
    setSelectedPurchaseInvoice(invoiceId);
    const invoice = purchaseInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      // Map invoice items to return items with 0 return quantity and bonus
      const mappedItems = invoice.items.map(item => ({
        ...item,
        returnQuantity: 0,
        returnBonus: 0,
        amount: 0
      }));
      setReturnItems(mappedItems);
    } else {
      setReturnItems([]);
    }
  };

  const handleItemChange = (index: number, field: string, value: number) => {
    const updatedItems = [...returnItems];
    
    // Update the specified field
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Recalculate amount
    if (field === 'returnQuantity' || field === 'returnBonus') {
      updatedItems[index].amount = updatedItems[index].returnQuantity * updatedItems[index].price;
    }
    
    setReturnItems(updatedItems);
  };

  const getTotalReturnAmount = () => {
    return returnItems.reduce((total, item) => total + (item.amount || 0), 0);
  };

  const getNetReturnBill = () => {
    const total = getTotalReturnAmount();
    return total - discount;
  };

  const getBalance = () => {
    return previousBalance - getNetReturnBill();
  };

  const handleSave = () => {
    // Validation
    if (!selectedAccount) {
      toast({
        title: "Validation Error",
        description: "Please select a supplier account.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPurchaseInvoice) {
      toast({
        title: "Validation Error",
        description: "Please select a purchase invoice.",
        variant: "destructive"
      });
      return;
    }

    const hasReturns = returnItems.some(item => item.returnQuantity > 0 || item.returnBonus > 0);
    if (!hasReturns) {
      toast({
        title: "Validation Error",
        description: "Please enter return quantity or bonus for at least one item.",
        variant: "destructive"
      });
      return;
    }

    // Process the return (in a real app, this would save to database)
    toast({
      title: "Success",
      description: `Purchase return ${returnId} has been processed.`
    });

    // Increment the return ID for next return
    const nextId = `RET${String(parseInt(returnId.replace('RET', '')) + 1).padStart(3, '0')}`;
    setReturnId(nextId);
    
    // Reset form
    setDate(new Date());
    setSelectedAccount('');
    setSelectedPurchaseInvoice('');
    setBiltyNo('');
    setReturnItems([]);
    setDiscount(0);
    setPreviousBalance(0);
  };

  const filteredInvoices = selectedAccount 
    ? purchaseInvoices.filter(invoice => invoice.supplier === selectedAccount)
    : [];

  return (
    <PageContainer 
      title="Purchase Return" 
      subtitle="Process returns to suppliers"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Purchase Return
            </CardTitle>
            <CardDescription>
              Process and manage returns to suppliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="returnId">Return Invoice No</Label>
                  <Input 
                    id="returnId" 
                    value={returnId} 
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountId">Account ID</Label>
                  <Select
                    value={selectedAccount}
                    onValueChange={handleAccountChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.id} - {account.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="biltyNo">Bilty No</Label>
                  <Input 
                    id="biltyNo" 
                    value={biltyNo} 
                    onChange={(e) => setBiltyNo(e.target.value)}
                    placeholder="Enter bilty number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseInvoice">Purchase Invoice No</Label>
                  <Select
                    value={selectedPurchaseInvoice}
                    onValueChange={handlePurchaseInvoiceChange}
                    disabled={!selectedAccount}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedAccount ? "Select invoice" : "Select account first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredInvoices.map(invoice => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.id} - {format(invoice.date, "MM/dd/yyyy")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Search Items</Label>
                  <SearchInput 
                    value={searchQuery} 
                    onChange={setSearchQuery} 
                    placeholder="Search by item code or name..."
                  />
                </div>
              </div>
              
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Packing</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Purchased Qty</TableHead>
                      <TableHead className="text-center">Purchased Bonus</TableHead>
                      <TableHead className="text-center">Return Qty</TableHead>
                      <TableHead className="text-center">Return Bonus</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnItems.length > 0 ? (
                      returnItems
                        .filter(item => 
                          searchQuery === '' || 
                          item.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((item, index) => (
                          <TableRow key={item.code}>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.company}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.packing}</TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-center">{item.bonus}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max={item.quantity}
                                value={item.returnQuantity}
                                onChange={(e) => handleItemChange(index, 'returnQuantity', parseInt(e.target.value) || 0)}
                                className="text-center w-20 mx-auto"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max={item.bonus}
                                value={item.returnBonus}
                                onChange={(e) => handleItemChange(index, 'returnBonus', parseInt(e.target.value) || 0)}
                                className="text-center w-20 mx-auto"
                              />
                            </TableCell>
                            <TableCell className="text-right">${item.amount?.toFixed(2) || '0.00'}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          {selectedPurchaseInvoice ? "No items in this purchase invoice" : "Select a purchase invoice to display items"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <CustomButton
                      variant="outline3D"
                      onClick={() => {
                        // Clear form for new return
                        setDate(new Date());
                        setSelectedAccount('');
                        setSelectedPurchaseInvoice('');
                        setBiltyNo('');
                        setReturnItems([]);
                        setDiscount(0);
                        setPreviousBalance(0);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      New
                    </CustomButton>
                    
                    <CustomButton
                      variant="outline3D"
                      onClick={() => {
                        toast({
                          title: "Edit",
                          description: "Edit functionality will be implemented here."
                        });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </CustomButton>
                    
                    <CustomButton
                      variant="outline3D"
                      onClick={() => {
                        toast({
                          title: "Delete",
                          description: "Delete functionality will be implemented here."
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </CustomButton>
                    
                    <CustomButton
                      onClick={handleSave}
                    >
                      <Save className="h-4 w-4" />
                      Update
                    </CustomButton>
                  </div>
                </div>
                
                <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Net Return Bill:</span>
                      <span className="font-semibold">${getNetReturnBill().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Previous Balance:</span>
                      <span className="font-medium">${previousBalance.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Balance:</span>
                      <span className="font-semibold">${getBalance().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default PurchaseReturn;
