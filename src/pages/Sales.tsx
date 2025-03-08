
import React, { useState, useRef } from 'react';
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
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

const mockItems = [
  { id: 1, code: 'MD001', itemCode: 'IC001', name: 'Surgical Gloves', packing: '100/box', stock: 120, price: 45.99 },
  { id: 2, code: 'MD002', itemCode: 'IC002', name: 'Digital Thermometer', packing: '1/unit', stock: 35, price: 89.99 },
  { id: 3, code: 'MD003', itemCode: 'IC003', name: 'Bandages (Premium)', packing: '50/pack', stock: 75, price: 34.50 },
  { id: 4, code: 'MD004', itemCode: 'IC004', name: 'Disinfectant Solution', packing: '500ml', stock: 48, price: 62.25 },
  { id: 5, code: 'MD005', itemCode: 'IC005', name: 'Penicillin Injection', packing: '10/pack', stock: 15, price: 124.99 },
];

const mockCustomers = [
  { id: 1, accountId: 'CUST001', name: 'Memorial Hospital', retailer: 'Yes', balance: 5000.00, lastPurchase: '2023-12-15', lastDiscount: 5 },
  { id: 2, accountId: 'CUST002', name: 'City Clinic', retailer: 'No', balance: 3500.00, lastPurchase: '2024-01-10', lastDiscount: 3 },
  { id: 3, accountId: 'CUST003', name: 'Riverside Medical Center', retailer: 'Yes', balance: 12000.00, lastPurchase: '2023-11-20', lastDiscount: 7 },
  { id: 4, accountId: 'CUST004', name: 'Lakeside Pharmacy', retailer: 'Yes', balance: 2800.00, lastPurchase: '2024-01-25', lastDiscount: 4 },
];

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
  const [showInvoiceSummary, setShowInvoiceSummary] = useState(false);
  const [viewingEstimate, setViewingEstimate] = useState(false);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [showFindBillModal, setShowFindBillModal] = useState(false);
  const [savedInvoices, setSavedInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const thermalPrintRef = useRef(null);

  const { toast } = useToast();

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
    setShowInvoiceSummary(true);
  };

  // Fixed the print functionality to properly return a Promise
  const handlePrintThermal = useReactToPrint({
    documentTitle: `Invoice-${invoiceNo}`,
    onBeforePrint: () => {
      console.log("Preparing to print...");
    },
    onAfterPrint: () => {
      toast({
        title: "Printing Complete",
        description: "Your thermal receipt has been printed.",
      });
    },
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: 80mm 297mm;
        margin: 5mm;
      }
      @media print {
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.2;
        }
      }
    `,
    content: () => {
      return Promise.resolve(thermalPrintRef.current);
    },
  });

  const printThermal = () => {
    if (invoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Cannot print an empty invoice. Please add items.",
        variant: "destructive"
      });
      return;
    }
    
    if (thermalPrintRef.current) {
      handlePrintThermal();
    } else {
      toast({
        title: "Error",
        description: "Print component not ready. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generatePDF = () => {
    if (invoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Cannot generate PDF for an empty invoice. Please add items.",
        variant: "destructive"
      });
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Set document metadata
      doc.setProperties({
        title: `Invoice-${invoiceNo}`,
        subject: 'Sales Invoice',
        author: 'MedFlow Healthcare Solutions',
        keywords: 'invoice, sales, healthcare',
        creator: 'MedFlow Invoice System'
      });
      
      // Company header
      doc.setFontSize(18);
      doc.text('MedFlow Healthcare Solutions', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Invoice', 105, 25, { align: 'center' });
      
      // Invoice details
      doc.setFontSize(10);
      doc.text(`Invoice No: ${invoiceNo}`, 15, 35);
      doc.text(`Date: ${invoiceDate}`, 15, 40);
      doc.text(`Supply No: ${supplyNo || 'N/A'}`, 15, 45);
      
      const salesmanName = selectedSalesman 
        ? mockSalesmen.find(s => s.id.toString() === selectedSalesman)?.name || 'N/A' 
        : 'N/A';
      
      doc.text(`Salesman: ${salesmanName}`, 130, 35);
      
      if (selectedCustomer) {
        doc.text(`Customer: ${selectedCustomer.name}`, 130, 40);
        doc.text(`Account ID: ${selectedCustomer.accountId}`, 130, 45);
      }
      
      // Table content
      const tableColumn = ['#', 'Item Code', 'Item Name', 'Packing', 'Qty', 'Price', 'Bonus', 'Gross', 'Discount', 'Net'];
      const tableRows = invoiceItems.map((item, index) => [
        index + 1,
        item.itemCode,
        item.itemName,
        item.packing,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        item.bonus,
        `$${item.grossAmount.toFixed(2)}`,
        `$${item.discountAmount.toFixed(2)}`,
        `$${item.netAmount.toFixed(2)}`
      ]);
      
      // Draw the table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 135, 245] }
      });
      
      const finalY = doc.lastAutoTable.finalY || 150;
      
      // Summary information
      doc.text(`Total Items: ${totalItems}`, 130, finalY + 10);
      doc.text(`Gross Amount: $${grossBillAmount.toFixed(2)}`, 130, finalY + 15);
      doc.text(`Discount Amount: $${discountAmount.toFixed(2)}`, 130, finalY + 20);
      doc.text(`Net Amount: $${netBillAmount.toFixed(2)}`, 130, finalY + 25);
      doc.text(`Previous Balance: $${previousBalance.toFixed(2)}`, 130, finalY + 30);
      doc.text(`Cash Received: $${cashReceived.toFixed(2)}`, 130, finalY + 35);
      doc.text(`Final Amount: $${finalAmount.toFixed(2)}`, 130, finalY + 40);
      
      // Footer
      doc.setFontSize(8);
      doc.text('Thank you for your business!', 105, finalY + 50, { align: 'center' });
      doc.text(`Generated on ${new Date().toLocaleString()}`, 105, finalY + 55, { align: 'center' });
      
      // Save the PDF
      doc.save(`Invoice-${invoiceNo}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: `Invoice ${invoiceNo} has been generated as PDF.`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Generation Failed",
        description: "An error occurred while generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
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

    const invoiceToSave = {
      id: Date.now().toString(),
      invoiceNo,
      invoiceDate,
      supplyNo,
      salesman: selectedSalesman 
        ? mockSalesmen.find(s => s.id.toString() === selectedSalesman) 
        : null,
      carrier,
      customer: selectedCustomer,
      items: [...invoiceItems],
      discountPercentage,
      grossAmount: grossBillAmount,
      discountAmount,
      netAmount: netBillAmount,
      previousBalance,
      cashReceived,
      finalAmount,
      timestamp: new Date().toISOString()
    };

    setSavedInvoices([...savedInvoices, invoiceToSave]);

    toast({
      title: "Invoice Saved",
      description: `Invoice ${invoiceNo} has been saved successfully.`,
    });

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
    setShowInvoiceSummary(false);
    setViewingEstimate(false);
    setSelectedEstimate(null);
  };

  const handleCreateEstimate = () => {
    if (invoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Cannot create an estimate with no items. Please add items.",
        variant: "destructive"
      });
      return;
    }

    const estimate = {
      id: Date.now().toString(),
      estimateNo: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customer: selectedCustomer,
      items: [...invoiceItems],
      grossAmount: grossBillAmount,
      discountAmount,
      netAmount: netBillAmount
    };

    setEstimates([...estimates, estimate]);

    toast({
      title: "Estimate Created",
      description: `Estimate ${estimate.estimateNo} has been created.`,
    });
  };

  const handleViewEstimates = () => {
    setViewingEstimate(true);
  };

  const handleLoadEstimate = (estimate: any) => {
    setSelectedEstimate(estimate);
    setInvoiceItems(estimate.items);
    if (estimate.customer) {
      setSelectedCustomer(estimate.customer);
    }
    setViewingEstimate(false);
    setShowInvoiceSummary(true);

    toast({
      title: "Estimate Loaded",
      description: `Estimate ${estimate.estimateNo} has been loaded.`,
    });
  };

  const handleShowFindBill = () => {
    setShowFindBillModal(true);
  };

  const handleLoadInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setInvoiceNo(invoice.invoiceNo);
    setInvoiceDate(invoice.invoiceDate);
    setSupplyNo(invoice.supplyNo || '');
    setSelectedSalesman(invoice.salesman?.id.toString() || '');
    setCarrier(invoice.carrier || '');
    setSelectedCustomer(invoice.customer);
    setInvoiceItems(invoice.items);
    setDiscountPercentage(invoice.discountPercentage);
    setCashReceived(invoice.cashReceived);
    setShowFindBillModal(false);
    setShowInvoiceSummary(true);

    toast({
      title: "Invoice Loaded",
      description: `Invoice ${invoice.invoiceNo} has been loaded.`,
    });
  };

  const handleViewAccount = () => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer to view their account.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Account Information",
      description: `Viewing account details for ${selectedCustomer.name}.`,
    });
  };

  return (
    <PageContainer 
      title="Sales / Invoicing" 
      subtitle="Create and manage sales invoices"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {showInvoiceSummary && (
              <div className="bg-muted/50 p-3 rounded-md mb-4 text-sm">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="font-medium">Invoice No:</div>
                  <div className="text-right">{invoiceNo}</div>
                  
                  <div className="font-medium">Date:</div>
                  <div className="text-right">{invoiceDate}</div>
                  
                  <div className="font-medium">Salesman:</div>
                  <div className="text-right">
                    {selectedSalesman 
                      ? mockSalesmen.find(s => s.id.toString() === selectedSalesman)?.name || 'N/A' 
                      : 'N/A'}
                  </div>
                  
                  <div className="font-medium">Customer:</div>
                  <div className="text-right">{selectedCustomer?.name || 'N/A'}</div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-border/50">
                  <div className="font-medium mb-1">Items:</div>
                  <ul className="list-disc list-inside text-xs space-y-1 max-h-24 overflow-y-auto">
                    {invoiceItems.map((item, idx) => (
                      <li key={idx} className="truncate">
                        {item.itemName} x {item.quantity} (${item.netAmount.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
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
              
              <div className="text-sm text-muted-foreground">Cash Received:</div>
              <div className="text-sm font-semibold text-right">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-24 p-1 rounded border border-input bg-background text-right"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                />
              </div>
              
              <div className="text-sm font-medium text-muted-foreground">Final Amount:</div>
              <div className="text-sm font-bold text-right">${finalAmount.toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={handleViewAccount}>
                <FileSearch className="mr-1 h-4 w-4" />
                View Account
              </Button>
              <Button variant="outline" size="sm" onClick={handleCreateEstimate}>
                <Calculator className="mr-1 h-4 w-4" />
                Create Estimate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Print reference - hidden but used for printing */}
      <div className="hidden">
        <div ref={thermalPrintRef} className="p-4 font-mono text-sm" style={{ width: '80mm' }}>
          <div className="text-center mb-4">
            <div className="font-bold text-lg">MedFlow Healthcare</div>
            <div>123 Medical Avenue</div>
            <div>+1 (555) 123-4567</div>
            <div className="mt-2 text-xs">Tax ID: 12-3456789</div>
            <div className="border-t border-b border-gray-400 my-2 py-1">SALES RECEIPT</div>
          </div>
          
          <div className="mb-4">
            <div>Invoice: {invoiceNo}</div>
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Customer: {selectedCustomer?.name || 'Walk-in Customer'}</div>
            <div>Salesman: {selectedSalesman 
              ? mockSalesmen.find(s => s.id.toString() === selectedSalesman)?.name 
              : 'N/A'}</div>
          </div>
          
          <div className="border-t border-gray-400 pt-2 mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="w-24 overflow-hidden">Item</span>
              <span className="w-8 text-center">Qty</span>
              <span className="w-12 text-right">Price</span>
              <span className="w-16 text-right">Amount</span>
            </div>
            
            {invoiceItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs py-1 border-t border-gray-200">
                <span className="w-24 overflow-hidden truncate">{item.itemName}</span>
                <span className="w-8 text-center">{item.quantity}</span>
                <span className="w-12 text-right">${item.price.toFixed(2)}</span>
                <span className="w-16 text-right">${item.netAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-400 pt-2">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>${grossBillAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Discount:</span>
              <span>${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${netBillAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Cash Received:</span>
              <span>${cashReceived.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Balance Due:</span>
              <span>${(netBillAmount - cashReceived > 0 ? netBillAmount - cashReceived : 0).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6 text-center text-xs">
            <div>Thank you for your business!</div>
            <div className="mt-2">Powered by MedFlow ERP</div>
            <div className="mt-4">
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for viewing estimates */}
      {viewingEstimate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Saved Estimates</h3>
            
            {estimates.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Estimate No</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimates.map((est) => (
                      <tr key={est.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-2">{est.estimateNo}</td>
                        <td className="px-4 py-2">{est.date}</td>
                        <td className="px-4 py-2">{est.customer?.name || 'N/A'}</td>
                        <td className="px-4 py-2 text-right">${est.netAmount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-center">
                          <Button variant="outline" size="sm" onClick={() => handleLoadEstimate(est)}>
                            Load
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-2" />
                No estimates available
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setViewingEstimate(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for finding bills */}
      {showFindBillModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Find Bills</h3>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                  placeholder="Search by invoice number or customer name..."
                />
              </div>
            </div>
            
            {savedInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Invoice No</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-2">{inv.invoiceNo}</td>
                        <td className="px-4 py-2">{inv.invoiceDate}</td>
                        <td className="px-4 py-2">{inv.customer?.name || 'N/A'}</td>
                        <td className="px-4 py-2 text-right">${inv.netAmount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-center">
                          <Button variant="outline" size="sm" onClick={() => handleLoadInvoice(inv)}>
                            Load
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                No saved invoices available
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowFindBillModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Sales;
