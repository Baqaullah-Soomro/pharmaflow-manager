
import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  Printer, 
  Search, 
  RefreshCw,
  Package,
  DollarSign,
  Edit,
  Trash2,
  FileSearch,
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import { useToast } from '@/components/ui/use-toast';

// Mock data for sales invoices
const mockSalesInvoices = [
  { id: 1, invoiceNo: 'INV-2024-0001', customer: 'Memorial Hospital', date: '2024-01-15', total: 1245.50 },
  { id: 2, invoiceNo: 'INV-2024-0002', customer: 'City Clinic', date: '2024-01-20', total: 875.25 },
  { id: 3, invoiceNo: 'INV-2024-0003', customer: 'Riverside Medical Center', date: '2024-02-05', total: 2340.00 },
  { id: 4, invoiceNo: 'INV-2024-0004', customer: 'Lakeside Pharmacy', date: '2024-02-18', total: 1560.75 },
];

// Mock data for invoice items
const mockInvoiceItems = [
  { id: 1, invoiceId: 1, itemCode: 'IC001', company: 'MediTech', name: 'Surgical Gloves', packing: '100/box', salePrice: 45.99, saleQuantity: 5, saleBonus: 1 },
  { id: 2, invoiceId: 1, itemCode: 'IC002', company: 'TechMed', name: 'Digital Thermometer', packing: '1/unit', salePrice: 89.99, saleQuantity: 3, saleBonus: 0 },
  { id: 3, invoiceId: 2, itemCode: 'IC003', company: 'HealthFirst', name: 'Bandages (Premium)', packing: '50/pack', salePrice: 34.50, saleQuantity: 10, saleBonus: 2 },
  { id: 4, invoiceId: 3, itemCode: 'IC004', company: 'CleanMed', name: 'Disinfectant Solution', packing: '500ml', salePrice: 62.25, saleQuantity: 8, saleBonus: 1 },
  { id: 5, invoiceId: 4, itemCode: 'IC005', company: 'PharmaPlus', name: 'Penicillin Injection', packing: '10/pack', salePrice: 124.99, saleQuantity: 4, saleBonus: 0 },
];

// Mock data for customers
const mockCustomers = [
  { id: 1, name: 'Memorial Hospital', balance: 5000.00 },
  { id: 2, name: 'City Clinic', balance: 3500.00 },
  { id: 3, name: 'Riverside Medical Center', balance: 12000.00 },
  { id: 4, name: 'Lakeside Pharmacy', balance: 2800.00 },
];

// Mock data for salesmen
const mockSalesmen = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'David Martinez' },
  { id: 3, name: 'Sarah Johnson' },
];

interface ReturnItemType {
  id: number;
  itemCode: string;
  company: string;
  itemName: string;
  packing: string;
  salePrice: number;
  saleQuantity: number;
  saleBonus: number;
  returnQuantity: number;
  returnBonus: number;
  totalAmount: number;
}

const SalesReturn = () => {
  const [returnInvoiceNo, setReturnInvoiceNo] = useState('RET-2024-0001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedSalesInvoice, setSelectedSalesInvoice] = useState<any>(null);
  const [returnItems, setReturnItems] = useState<ReturnItemType[]>([]);
  const [searchInvoiceTerm, setSearchInvoiceTerm] = useState('');
  
  const { toast } = useToast();

  // Calculate totals
  const netBillPayable = returnItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const previousBalance = selectedCustomer?.balance || 0;
  const finalBalance = previousBalance - netBillPayable;

  const filteredInvoices = mockSalesInvoices.filter(invoice => 
    searchInvoiceTerm === '' || 
    invoice.invoiceNo.toLowerCase().includes(searchInvoiceTerm.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(searchInvoiceTerm.toLowerCase())
  );

  const handleInvoiceSelect = (invoice: any) => {
    setSelectedSalesInvoice(invoice);
    const customer = mockCustomers.find(c => c.name === invoice.customer);
    setSelectedCustomer(customer);
    
    // Get invoice items
    const items = mockInvoiceItems.filter(item => item.invoiceId === invoice.id);
    
    // Map to return items
    const mappedItems = items.map(item => ({
      id: item.id,
      itemCode: item.itemCode,
      company: item.company,
      itemName: item.name,
      packing: item.packing,
      salePrice: item.salePrice,
      saleQuantity: item.saleQuantity,
      saleBonus: item.saleBonus,
      returnQuantity: 0,
      returnBonus: 0,
      totalAmount: 0
    }));
    
    setReturnItems(mappedItems);
    setSearchInvoiceTerm(invoice.invoiceNo);
  };

  const handleQuantityChange = (id: number, field: 'returnQuantity' | 'returnBonus', value: number) => {
    setReturnItems(returnItems.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          [field]: value
        };
        
        // Recalculate total amount for this item
        updatedItem.totalAmount = updatedItem.returnQuantity * updatedItem.salePrice;
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleSaveReturn = () => {
    if (returnItems.length === 0 || !returnItems.some(item => item.returnQuantity > 0)) {
      toast({
        title: "Error",
        description: "Please add at least one return item with quantity greater than zero.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save the return to your database
    toast({
      title: "Return Saved",
      description: `Return ${returnInvoiceNo} has been saved successfully.`,
    });

    // Reset form for next return
    resetForm();
  };

  const resetForm = () => {
    setReturnItems([]);
    setSelectedSalesInvoice(null);
    setSelectedCustomer(null);
    setSearchInvoiceTerm('');
    setReturnInvoiceNo(`RET-2024-${Math.floor(1000 + Math.random() * 9000)}`);
    setTitle('');
  };

  const printReturn = () => {
    toast({
      title: "Printing",
      description: "Your return invoice is being printed.",
    });
    // In a real application, you would print the return here
  };

  return (
    <PageContainer 
      title="Sales Return" 
      subtitle="Process and manage product returns from customers"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Return Header */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>New Sales Return</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
                <Button variant="outline" onClick={printReturn}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button onClick={handleSaveReturn}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="returnInvoiceNo" className="block text-sm font-medium mb-1">Return Invoice No</label>
                  <input
                    id="returnInvoiceNo"
                    type="text"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={returnInvoiceNo}
                    onChange={(e) => setReturnInvoiceNo(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium mb-1">Customer Name</label>
                  <input
                    id="customer"
                    type="text"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={selectedCustomer?.name || ''}
                    readOnly
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="salesman" className="block text-sm font-medium mb-1">Salesman</label>
                  <select
                    id="salesman"
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
                  <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                  <input
                    id="date"
                    type="date"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                  <input
                    id="title"
                    type="text"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="salesInvoice" className="block text-sm font-medium mb-1">Sales Invoice No</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      id="salesInvoice"
                      type="text"
                      className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                      placeholder="Search invoice..."
                      value={searchInvoiceTerm}
                      onChange={(e) => setSearchInvoiceTerm(e.target.value)}
                    />
                    {searchInvoiceTerm && !selectedSalesInvoice && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredInvoices.map(invoice => (
                          <div
                            key={invoice.id}
                            className="p-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleInvoiceSelect(invoice)}
                          >
                            <div className="font-medium">{invoice.invoiceNo}</div>
                            <div className="text-sm text-muted-foreground">
                              {invoice.customer} | {invoice.date} | ${invoice.total.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {selectedSalesInvoice && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Invoice Date</label>
                      <div className="p-2 bg-muted rounded-md">{selectedSalesInvoice.date}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Invoice Total</label>
                      <div className="p-2 bg-muted rounded-md">${selectedSalesInvoice.total.toFixed(2)}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Return Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Return Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Item Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Company</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Item Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Packing</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Sale Price</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Sale Qty</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Sale Bonus</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Return Qty</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Return Bonus</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {returnItems.length > 0 ? (
                    returnItems.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-2 text-sm">{item.itemCode}</td>
                        <td className="px-4 py-2 text-sm">{item.company}</td>
                        <td className="px-4 py-2 text-sm">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                            {item.itemName}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm">{item.packing}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.salePrice.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.saleQuantity}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.saleBonus}</td>
                        <td className="px-4 py-2 text-sm text-right">
                          <input
                            type="number"
                            min="0"
                            max={item.saleQuantity}
                            className="w-20 p-1 rounded-md border border-input bg-background text-right"
                            value={item.returnQuantity}
                            onChange={(e) => handleQuantityChange(item.id, 'returnQuantity', Number(e.target.value))}
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          <input
                            type="number"
                            min="0"
                            max={item.saleBonus}
                            className="w-20 p-1 rounded-md border border-input bg-background text-right"
                            value={item.returnBonus}
                            onChange={(e) => handleQuantityChange(item.id, 'returnBonus', Number(e.target.value))}
                          />
                        </td>
                        <td className="px-4 py-2 text-sm text-right">${item.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                        <RefreshCw className="h-8 w-8 mx-auto mb-2" />
                        {selectedSalesInvoice ? 'No items in the selected invoice' : 'Please select a sales invoice'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Return Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Return Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Net Bill Payable:</div>
              <div className="text-sm font-semibold text-right">${netBillPayable.toFixed(2)}</div>
              
              <div className="border-t border-border pt-2 text-sm text-muted-foreground">Previous Balance:</div>
              <div className="border-t border-border pt-2 text-sm font-semibold text-right">
                ${previousBalance.toFixed(2)}
              </div>
              
              <div className="text-sm font-medium">Balance:</div>
              <div className="text-sm font-bold text-right">${finalBalance.toFixed(2)}</div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full grid grid-cols-3 gap-2">
              <CustomButton variant="outline3D" className="w-full" asChild>
                <div className="flex flex-col items-center justify-center p-1">
                  <Printer className="h-4 w-4 mb-1" />
                  <span className="text-xs">Print Bill</span>
                </div>
              </CustomButton>
              
              <CustomButton variant="outline3D" className="w-full" asChild>
                <div className="flex flex-col items-center justify-center p-1">
                  <Edit className="h-4 w-4 mb-1" />
                  <span className="text-xs">Edit</span>
                </div>
              </CustomButton>
              
              <CustomButton variant="outline3D" className="w-full" asChild>
                <div className="flex flex-col items-center justify-center p-1">
                  <DollarSign className="h-4 w-4 mb-1" />
                  <span className="text-xs">Show Account</span>
                </div>
              </CustomButton>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SalesReturn;
