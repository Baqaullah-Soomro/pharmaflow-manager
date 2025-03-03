
import React, { useState } from 'react';
import { RefreshCw, Search, Calendar, Save, Edit, Trash, FileText, Plus } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';
import { toast } from "@/hooks/use-toast";

// Mock data for suppliers and companies
const suppliers = [
  { id: 'SUP001', name: 'MediSupply Co' },
  { id: 'SUP002', name: 'PharmaCare Distributors' },
  { id: 'SUP003', name: 'Healthcare Wholesale' },
  { id: 'SUP004', name: 'Medical Instruments Ltd' },
];

const companies = ['MediCorp', 'PharmaSolutions', 'HealthTech', 'MediGlobal', 'BioLife'];

// Mock inventory data
const mockInventory = [
  { id: 1, itemCode: 'MED001', company: 'MediCorp', itemName: 'Paracetamol 500mg', packing: '10x10', price: 5.50 },
  { id: 2, itemCode: 'MED002', company: 'PharmaSolutions', itemName: 'Amoxicillin 250mg', packing: '6x10', price: 8.75 },
  { id: 3, itemCode: 'MED003', company: 'HealthTech', itemName: 'Vitamin C 1000mg', packing: '3x10', price: 12.25 },
  { id: 4, itemCode: 'MED004', company: 'MediGlobal', itemName: 'Flu Vaccine', packing: '1x10', price: 45.00 },
  { id: 5, itemCode: 'MED005', company: 'BioLife', itemName: 'Digital Thermometer', packing: '1x1', price: 15.50 },
];

// Mock purchase invoice data
const mockPurchaseInvoices = [
  { id: 'PI001', supplier: 'SUP001', date: '2023-04-10', biltyNo: 'B001', amount: 5000 },
  { id: 'PI002', supplier: 'SUP002', date: '2023-04-12', biltyNo: 'B002', amount: 7500 },
  { id: 'PI003', supplier: 'SUP003', date: '2023-04-14', biltyNo: 'B003', amount: 3200 },
  { id: 'PI004', supplier: 'SUP001', date: '2023-04-15', biltyNo: 'B004', amount: 6800 },
];

// Interface for return items
interface ReturnItem {
  id: string;
  itemCode: string;
  company: string;
  itemName: string;
  packing: string;
  purchaseQty: number;
  purchaseBonus: number;
  returnQty: number;
  returnBonus: number;
  price: number;
  amount: number;
}

const PurchaseReturn = () => {
  // Form state
  const [invoiceNo, setInvoiceNo] = useState('PR001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');
  const [biltyNo, setBiltyNo] = useState('');
  const [purchaseInvoiceNo, setPurchaseInvoiceNo] = useState('');
  const [discount, setDiscount] = useState('0');
  
  // Item selection state
  const [itemCode, setItemCode] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [purchaseQty, setPurchaseQty] = useState('0');
  const [purchaseBonus, setPurchaseBonus] = useState('0');
  const [returnQty, setReturnQty] = useState('0');
  const [returnBonus, setReturnBonus] = useState('0');
  
  // Return items
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  
  // Supplier details
  const [supplierBalance, setSupplierBalance] = useState(15000);
  
  // Handle item selection
  const handleItemSelect = (code: string) => {
    const item = mockInventory.find(i => i.itemCode === code);
    if (item) {
      setSelectedItem(item);
      setItemCode(item.itemCode);
      // In a real app, you would fetch the purchase qty and bonus from the selected invoice
      setPurchaseQty('10');
      setPurchaseBonus('2');
      setReturnQty('0');
      setReturnBonus('0');
    }
  };
  
  // Handle adding item to return
  const handleAddItem = () => {
    if (!selectedItem) {
      toast({
        title: "Error",
        description: "Please select an item first.",
        variant: "destructive"
      });
      return;
    }
    
    if (parseInt(returnQty) <= 0) {
      toast({
        title: "Error",
        description: "Return quantity must be greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (parseInt(returnQty) > parseInt(purchaseQty)) {
      toast({
        title: "Error",
        description: "Return quantity cannot exceed purchase quantity.",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseInt(returnQty) * selectedItem.price;
    
    const newItem: ReturnItem = {
      id: Date.now().toString(),
      itemCode: selectedItem.itemCode,
      company: selectedItem.company,
      itemName: selectedItem.itemName,
      packing: selectedItem.packing,
      purchaseQty: parseInt(purchaseQty),
      purchaseBonus: parseInt(purchaseBonus),
      returnQty: parseInt(returnQty),
      returnBonus: parseInt(returnBonus),
      price: selectedItem.price,
      amount
    };
    
    setReturnItems([...returnItems, newItem]);
    
    // Reset selection
    setItemCode('');
    setSelectedItem(null);
    setPurchaseQty('0');
    setPurchaseBonus('0');
    setReturnQty('0');
    setReturnBonus('0');
    
    toast({
      title: "Success",
      description: "Item added to return list.",
    });
  };
  
  // Handle removing item from return
  const handleRemoveItem = (id: string) => {
    setReturnItems(returnItems.filter(item => item.id !== id));
    toast({
      description: "Item removed from return list.",
    });
  };
  
  // Calculate totals
  const netReturnAmount = returnItems.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = parseFloat(discount) > 0 ? (netReturnAmount * parseFloat(discount) / 100) : 0;
  const finalAmount = netReturnAmount - discountAmount;
  const newBalance = supplierBalance - finalAmount;
  
  // Handle save return
  const handleSaveReturn = () => {
    if (!accountId) {
      toast({
        title: "Error",
        description: "Please select a supplier.",
        variant: "destructive"
      });
      return;
    }
    
    if (!purchaseInvoiceNo) {
      toast({
        title: "Error",
        description: "Please select a purchase invoice.",
        variant: "destructive"
      });
      return;
    }
    
    if (returnItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to return.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would save the return to the database
    toast({
      title: "Success",
      description: "Purchase return has been saved successfully.",
    });
    
    // Generate new invoice number for next return
    setInvoiceNo(`PR${String(parseInt(invoiceNo.substring(2)) + 1).padStart(3, '0')}`);
    
    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setAccountId('');
    setBiltyNo('');
    setPurchaseInvoiceNo('');
    setDiscount('0');
    setReturnItems([]);
  };
  
  return (
    <PageContainer 
      title="Purchase Return" 
      subtitle="Process and manage returns to suppliers"
    >
      <div className="space-y-8">
        {/* Return Header */}
        <Card>
          <CardHeader>
            <CardTitle>Return Details</CardTitle>
            <CardDescription>Enter return information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="invoiceNo" className="block text-sm font-medium mb-1">Invoice No</label>
                <input
                  id="invoiceNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-muted"
                  value={invoiceNo}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    id="date"
                    type="date"
                    className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="accountId" className="block text-sm font-medium mb-1">Account ID</label>
                <select
                  id="accountId"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value);
                    // In a real app, you would fetch supplier balance based on selected supplier
                    setSupplierBalance(15000);
                  }}
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="biltyNo" className="block text-sm font-medium mb-1">Bilty No</label>
                <input
                  id="biltyNo"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={biltyNo}
                  onChange={(e) => setBiltyNo(e.target.value)}
                  placeholder="Enter bilty number"
                />
              </div>
              
              <div>
                <label htmlFor="purchaseInvoiceNo" className="block text-sm font-medium mb-1">Purchase Invoice No</label>
                <select
                  id="purchaseInvoiceNo"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={purchaseInvoiceNo}
                  onChange={(e) => setPurchaseInvoiceNo(e.target.value)}
                >
                  <option value="">-- Select Invoice --</option>
                  {mockPurchaseInvoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.id} - {invoice.date} (${invoice.amount})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="discount" className="block text-sm font-medium mb-1">Discount %</label>
                <input
                  id="discount"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Item Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Item Selection</CardTitle>
            <CardDescription>Select items to return</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label htmlFor="itemCode" className="block text-sm font-medium mb-1">Item Code</label>
                <select
                  id="itemCode"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={itemCode}
                  onChange={(e) => handleItemSelect(e.target.value)}
                >
                  <option value="">-- Select Item --</option>
                  {mockInventory.map((item) => (
                    <option key={item.id} value={item.itemCode}>
                      {item.itemCode} - {item.itemName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                <input
                  id="company"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-muted"
                  value={selectedItem?.company || ''}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium mb-1">Item Name</label>
                <input
                  id="itemName"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-muted"
                  value={selectedItem?.itemName || ''}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="packing" className="block text-sm font-medium mb-1">Packing</label>
                <input
                  id="packing"
                  type="text"
                  className="w-full p-2 rounded-md border border-input bg-muted"
                  value={selectedItem?.packing || ''}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="purchaseQty" className="block text-sm font-medium mb-1">Product Quantity</label>
                <input
                  id="purchaseQty"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-muted"
                  value={purchaseQty}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="purchaseBonus" className="block text-sm font-medium mb-1">Product Bonus</label>
                <input
                  id="purchaseBonus"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-muted"
                  value={purchaseBonus}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="returnQty" className="block text-sm font-medium mb-1">Return Quantity</label>
                <input
                  id="returnQty"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={returnQty}
                  onChange={(e) => setReturnQty(e.target.value)}
                  min="0"
                  max={purchaseQty}
                />
              </div>
              
              <div>
                <label htmlFor="returnBonus" className="block text-sm font-medium mb-1">Return Bonus</label>
                <input
                  id="returnBonus"
                  type="number"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={returnBonus}
                  onChange={(e) => setReturnBonus(e.target.value)}
                  min="0"
                  max={purchaseBonus}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <CustomButton 
                onClick={handleAddItem} 
                variant="premium"
                disabled={!selectedItem || parseInt(returnQty) <= 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </CustomButton>
            </div>
          </CardContent>
        </Card>
        
        {/* Return Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Return Items</CardTitle>
            <CardDescription>Items to be returned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left">Item Code</th>
                    <th className="px-3 py-2 text-left">Company</th>
                    <th className="px-3 py-2 text-left">Item Name</th>
                    <th className="px-3 py-2 text-center">Packing</th>
                    <th className="px-3 py-2 text-center">Pur. Qty</th>
                    <th className="px-3 py-2 text-center">Pur. Bonus</th>
                    <th className="px-3 py-2 text-center">Ret. Qty</th>
                    <th className="px-3 py-2 text-center">Ret. Bonus</th>
                    <th className="px-3 py-2 text-right">Price</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {returnItems.length > 0 ? (
                    returnItems.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-3 py-2">{item.itemCode}</td>
                        <td className="px-3 py-2">{item.company}</td>
                        <td className="px-3 py-2">{item.itemName}</td>
                        <td className="px-3 py-2 text-center">{item.packing}</td>
                        <td className="px-3 py-2 text-center">{item.purchaseQty}</td>
                        <td className="px-3 py-2 text-center">{item.purchaseBonus}</td>
                        <td className="px-3 py-2 text-center font-semibold">{item.returnQty}</td>
                        <td className="px-3 py-2 text-center">{item.returnBonus}</td>
                        <td className="px-3 py-2 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right font-semibold">${item.amount.toFixed(2)}</td>
                        <td className="px-3 py-2 text-center">
                          <CustomButton 
                            onClick={() => handleRemoveItem(item.id)} 
                            variant="outline3D"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </CustomButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-4 py-4 text-center text-muted-foreground">
                        No items added to return
                      </td>
                    </tr>
                  )}
                </tbody>
                {returnItems.length > 0 && (
                  <tfoot>
                    <tr className="bg-muted/80 font-semibold">
                      <td colSpan={9} className="px-3 py-2 text-right">Net Return Bill:</td>
                      <td className="px-3 py-2 text-right">${netReturnAmount.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    <tr className="bg-muted/60">
                      <td colSpan={9} className="px-3 py-2 text-right">Discount ({discount}%):</td>
                      <td className="px-3 py-2 text-right">${discountAmount.toFixed(2)}</td>
                      <td></td>
                    </tr>
                    <tr className="bg-muted/80 font-semibold">
                      <td colSpan={9} className="px-3 py-2 text-right">Final Amount:</td>
                      <td className="px-3 py-2 text-right">${finalAmount.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
            
            {/* Summary and Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:order-2">
                <div className="p-4 border rounded-md bg-muted/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Net Return Bill:</span>
                    <span className="font-medium">${netReturnAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount ({discount}%):</span>
                    <span className="font-medium">${discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Previous Balance:</span>
                    <span>${supplierBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Balance:</span>
                    <span>${newBalance.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 md:order-1">
                <CustomButton 
                  onClick={handleSaveReturn} 
                  variant="premium"
                  disabled={returnItems.length === 0 || !accountId || !purchaseInvoiceNo}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Return
                </CustomButton>
                
                <CustomButton 
                  variant="outline3D"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </CustomButton>
                
                <CustomButton 
                  variant="outline3D"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </CustomButton>
                
                <CustomButton 
                  variant="outline3D"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </CustomButton>
                
                <CustomButton 
                  variant="outline3D"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Print Bill
                </CustomButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default PurchaseReturn;
