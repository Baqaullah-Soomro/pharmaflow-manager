
import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  Printer, 
  FileText, 
  Search, 
  FilePlus2, 
  Calculator, 
  ShoppingCart,
  Receipt,
  Download,
  FileSearch,
  Trash2
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import { useToast } from '@/components/ui/use-toast';

// Mock data for items
const mockItems = [
  { id: 1, code: 'MD001', itemCode: 'IC001', name: 'Surgical Gloves', packing: '100/box', stock: 120, price: 45.99 },
  { id: 2, code: 'MD002', itemCode: 'IC002', name: 'Digital Thermometer', packing: '1/unit', stock: 35, price: 89.99 },
  { id: 3, code: 'MD003', itemCode: 'IC003', name: 'Bandages (Premium)', packing: '50/pack', stock: 75, price: 34.50 },
  { id: 4, code: 'MD004', itemCode: 'IC004', name: 'Disinfectant Solution', packing: '500ml', stock: 48, price: 62.25 },
  { id: 5, code: 'MD005', itemCode: 'IC005', name: 'Penicillin Injection', packing: '10/pack', stock: 15, price: 124.99 },
];

// Mock data for customers
const mockCustomers = [
  { id: 1, accountId: 'CUST001', name: 'Memorial Hospital', retailer: 'Yes', balance: 5000.00, lastPurchase: '2023-12-15', lastDiscount: 5 },
  { id: 2, accountId: 'CUST002', name: 'City Clinic', retailer: 'No', balance: 3500.00, lastPurchase: '2024-01-10', lastDiscount: 3 },
  { id: 3, accountId: 'CUST003', name: 'Riverside Medical Center', retailer: 'Yes', balance: 12000.00, lastPurchase: '2023-11-20', lastDiscount: 7 },
  { id: 4, accountId: 'CUST004', name: 'Lakeside Pharmacy', retailer: 'Yes', balance: 2800.00, lastPurchase: '2024-01-25', lastDiscount: 4 },
];

// Mock data for salesmen
const mockSalesmen = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'David Martinez' },
  { id: 3, name: 'Sarah Johnson' },
];

interface InvoiceItemType {
  id: number;
  itemCode: string;
  itemName: string;
  packing: string;
  quantity: number;
  price: number;
  bonus: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
}

const Sales = () => {
  const [invoiceNo, setInvoiceNo] = useState('INV-2024-0001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplyNo, setSupplyNo] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [carrier, setCarrier] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchItemTerm, setSearchItemTerm] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemType[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<InvoiceItemType>>({
    itemCode: '',
    quantity: 1,
    bonus: 0,
    price: 0
  });
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [cashReceived, setCashReceived] = useState(0);
  
  const { toast } = useToast();

  // Calculate invoice totals
  const totalItems = invoiceItems.length;
  const grossBillAmount = invoiceItems.reduce((sum, item) => sum + item.grossAmount, 0);
  const discountAmount = invoiceItems.reduce((sum, item) => sum + item.discountAmount, 0) + 
                         (grossBillAmount * (discountPercentage / 100));
  const netBillAmount = grossBillAmount - discountAmount;
  const previousBalance = selectedCustomer?.balance || 0;
  const netBill = netBillAmount + previousBalance;
  const finalAmount = netBill - cashReceived;

  const filteredItems = mockItems.filter(item => 
    searchItemTerm === '' || 
    item.name.toLowerCase().includes(searchItemTerm.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchItemTerm.toLowerCase())
  );

  const handleAddItem = () => {
    if (!currentItem.itemCode) {
      toast({
        title: "Error",
        description: "Please select an item to add",
        variant: "destructive"
      });
      return;
    }

    const selectedItem = mockItems.find(item => item.itemCode === currentItem.itemCode);
    if (!selectedItem) return;

    const quantity = currentItem.quantity || 1;
    const price = selectedItem.price;
    const bonus = currentItem.bonus || 0;
    const grossAmount = quantity * price;
    const itemDiscount = 0; // Can be calculated based on business logic
    const discountAmount = (grossAmount * itemDiscount) / 100;
    const netAmount = grossAmount - discountAmount;

    const newItem: InvoiceItemType = {
      id: Date.now(),
      itemCode: selectedItem.itemCode,
      itemName: selectedItem.name,
      packing: selectedItem.packing,
      quantity,
      price,
      bonus,
      grossAmount,
      discountAmount,
      netAmount
    };

    setInvoiceItems([...invoiceItems, newItem]);
    setCurrentItem({
      itemCode: '',
      quantity: 1,
      bonus: 0,
      price: 0
    });
    setSearchItemTerm('');
  };

  const handleRemoveItem = (id: number) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  const handleItemSelect = (item: any) => {
    setCurrentItem({
      ...currentItem,
      itemCode: item.itemCode,
      price: item.price
    });
    setSearchItemTerm(item.name);
  };

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
  };

  const handleSaveInvoice = () => {
    if (invoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Cannot save an empty invoice. Please add items.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save the invoice to your database
    toast({
      title: "Invoice Saved",
      description: `Invoice ${invoiceNo} has been saved successfully.`,
    });

    // For demonstration, we'll just clear the form
    resetInvoice();
  };

  const resetInvoice = () => {
    setInvoiceItems([]);
    setCurrentItem({
      itemCode: '',
      quantity: 1,
      bonus: 0,
      price: 0
    });
    setDiscountPercentage(0);
    setCashReceived(0);
    setSelectedCustomer(null);
    setInvoiceNo(`INV-2024-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const generatePDF = () => {
    toast({
      title: "Generating PDF",
      description: "Your invoice PDF is being generated.",
    });
    // In a real application, you would generate a PDF here
  };

  const printThermal = () => {
    toast({
      title: "Printing",
      description: "Your thermal receipt is being printed.",
    });
    // In a real application, you would print to a thermal printer here
  };

  return (
    <PageContainer 
      title="Sales / Invoicing" 
      subtitle="Create and manage sales invoices"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Invoice Header */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>New Invoice</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={resetInvoice}>
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  New
                </Button>
                <Button variant="outline" onClick={generatePDF}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" onClick={printThermal}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button onClick={handleSaveInvoice}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="invoiceNo" className="block text-sm font-medium mb-1">Invoice No</label>
                  <input
                    id="invoiceNo"
                    type="text"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                  <input
                    id="date"
                    type="date"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
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
                  <label htmlFor="carrier" className="block text-sm font-medium mb-1">Carrier</label>
                  <input
                    id="carrier"
                    type="text"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium mb-1">Discount on Invoice %</label>
                  <input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium mb-1">Customer</label>
                  <div className="relative">
                    <input
                      id="customer"
                      type="text"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      placeholder="Search customer..."
                      value={selectedCustomer ? selectedCustomer.name : ''}
                      onChange={(e) => !selectedCustomer && e.target.value}
                    />
                    {!selectedCustomer && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {mockCustomers.map(customer => (
                          <div
                            key={customer.id}
                            className="p-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {customer.accountId}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedCustomer && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Account ID</label>
                      <div className="p-2 bg-muted rounded-md">{selectedCustomer.accountId}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Retailer</label>
                      <div className="p-2 bg-muted rounded-md">{selectedCustomer.retailer}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Item Selection and Invoice Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div className="md:col-span-2 relative">
                <label htmlFor="itemSearch" className="block text-sm font-medium mb-1">Item</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="itemSearch"
                    type="text"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    placeholder="Search item..."
                    value={searchItemTerm}
                    onChange={(e) => setSearchItemTerm(e.target.value)}
                  />
                  {searchItemTerm && !currentItem.itemCode && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredItems.map(item => (
                        <div
                          key={item.id}
                          className="p-2 hover:bg-muted cursor-pointer"
                          onClick={() => handleItemSelect(item)}
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Code: {item.itemCode} | Stock: {item.stock}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: Number(e.target.value)})}
                />
              </div>
              
              <div>
                <label htmlFor="bonus" className="block text-sm font-medium mb-1">Bonus</label>
                <input
                  id="bonus"
                  type="number"
                  min="0"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentItem.bonus}
                  onChange={(e) => setCurrentItem({...currentItem, bonus: Number(e.target.value)})}
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({...currentItem, price: Number(e.target.value)})}
                />
              </div>
              
              <div>
                <Button onClick={handleAddItem} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Item Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Item Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Packing</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Quantity</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Bonus</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Gross Amount</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Discount</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Net Amount</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.length > 0 ? (
                    invoiceItems.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-2 text-sm">{item.itemCode}</td>
                        <td className="px-4 py-2 text-sm">{item.itemName}</td>
                        <td className="px-4 py-2 text-sm">{item.packing}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.bonus}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.grossAmount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.discountAmount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.netAmount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                        <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                        No items added to the invoice yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Invoice Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Total Items:</div>
              <div className="text-sm font-semibold text-right">{totalItems}</div>
              
              <div className="text-sm text-muted-foreground">Gross Bill Amount:</div>
              <div className="text-sm font-semibold text-right">${grossBillAmount.toFixed(2)}</div>
              
              <div className="text-sm text-muted-foreground">Discount Amount:</div>
              <div className="text-sm font-semibold text-right">${discountAmount.toFixed(2)}</div>
              
              <div className="text-sm text-muted-foreground">Net Bill Amount:</div>
              <div className="text-sm font-semibold text-right">${netBillAmount.toFixed(2)}</div>
              
              <div className="text-sm text-muted-foreground">Discount %:</div>
              <div className="text-sm font-semibold text-right">{discountPercentage}%</div>
              
              <div className="border-t border-border pt-2 text-sm text-muted-foreground">Previous Balance:</div>
              <div className="border-t border-border pt-2 text-sm font-semibold text-right">${previousBalance.toFixed(2)}</div>
              
              <div className="text-sm font-medium">Net Bill:</div>
              <div className="text-sm font-bold text-right">${netBill.toFixed(2)}</div>
            </div>
            
            <div className="pt-2">
              <label htmlFor="cashReceived" className="block text-sm font-medium mb-1">Cash Received</label>
              <input
                id="cashReceived"
                type="number"
                min="0"
                step="0.01"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={cashReceived}
                onChange={(e) => setCashReceived(Number(e.target.value))}
              />
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold">Final Amount:</div>
                <div className="text-lg font-bold">${finalAmount.toFixed(2)}</div>
              </div>
            </div>
            
            {selectedCustomer && (
              <div className="space-y-2 pt-4 border-t border-border">
                <h4 className="text-sm font-medium">Customer Details</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Last Purchase:</div>
                  <div className="text-sm text-right">{selectedCustomer.lastPurchase}</div>
                  
                  <div className="text-sm text-muted-foreground">Last Discount:</div>
                  <div className="text-sm text-right">{selectedCustomer.lastDiscount}%</div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full grid grid-cols-2 gap-2">
              <CustomButton variant="outline3D" className="w-full" asChild>
                <div className="flex flex-col items-center justify-center p-1">
                  <Calculator className="h-4 w-4 mb-1" />
                  <span className="text-xs">Account</span>
                </div>
              </CustomButton>
              
              <CustomButton variant="outline3D" className="w-full" asChild>
                <div className="flex flex-col items-center justify-center p-1">
                  <Receipt className="h-4 w-4 mb-1" />
                  <span className="text-xs">Find Bill</span>
                </div>
              </CustomButton>
              
              <CustomButton variant="outline3D" className="w-full" asChild>
                <div className="flex flex-col items-center justify-center p-1">
                  <FileText className="h-4 w-4 mb-1" />
                  <span className="text-xs">Estimate</span>
                </div>
              </CustomButton>
              
              <CustomButton variant="outline3D" className="w-full" asChild>
                <div className="flex flex-col items-center justify-center p-1">
                  <FileSearch className="h-4 w-4 mb-1" />
                  <span className="text-xs">View Est.</span>
                </div>
              </CustomButton>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Sales;
