
import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  Search, 
  FileText, 
  Package,
  Filter,
  Edit,
  Trash2,
  DollarSign,
  Warehouse
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';
import { useToast } from '@/components/ui/use-toast';

// Mock data for items
const mockItems = [
  { id: 1, code: 'MD001', itemCode: 'IC001', name: 'Surgical Gloves', company: 'MediTech', packing: '100/box', pPrice: 35.50 },
  { id: 2, code: 'MD002', itemCode: 'IC002', name: 'Digital Thermometer', company: 'TechMed', packing: '1/unit', pPrice: 78.25 },
  { id: 3, code: 'MD003', itemCode: 'IC003', name: 'Bandages (Premium)', company: 'HealthFirst', packing: '50/pack', pPrice: 28.75 },
  { id: 4, code: 'MD004', itemCode: 'IC004', name: 'Disinfectant Solution', company: 'CleanMed', packing: '500ml', pPrice: 52.00 },
  { id: 5, code: 'MD005', itemCode: 'IC005', name: 'Penicillin Injection', company: 'PharmaPlus', packing: '10/pack', pPrice: 110.50 },
];

// Mock data for suppliers
const mockSuppliers = [
  { id: 1, title: 'MediTech Supplies', balance: 15000.00 },
  { id: 2, title: 'PharmaPlus Distributors', balance: 22000.00 },
  { id: 3, title: 'HealthFirst Medical', balance: 8500.00 },
  { id: 4, title: 'CleanMed Solutions', balance: 12000.00 },
];

interface PurchaseItemType {
  id: number;
  code: string;
  itemCode: string;
  itemName: string;
  packing: string;
  quantity: number;
  bonus: number;
  pPrice: number;
  amount: number;
  company: string;
}

const Purchase = () => {
  const [invoiceNo, setInvoiceNo] = useState('PUR-2024-0001');
  const [supplierBillNo, setSupplierBillNo] = useState('');
  const [biltyNo, setBiltyNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [searchItemTerm, setSearchItemTerm] = useState('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItemType[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<PurchaseItemType>>({
    code: '',
    itemCode: '',
    quantity: 1,
    bonus: 0,
    pPrice: 0
  });
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [cashPaid, setCashPaid] = useState(0);
  
  const { toast } = useToast();

  // Calculate purchase totals
  const totalItems = purchaseItems.length;
  const grossBillAmount = purchaseItems.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = grossBillAmount * (discountPercentage / 100);
  const netBillPayable = grossBillAmount - discountAmount;
  const previousBalance = selectedSupplier?.balance || 0;
  const netBalance = previousBalance + netBillPayable - cashPaid;

  const filteredItems = mockItems.filter(item => 
    searchItemTerm === '' || 
    item.name.toLowerCase().includes(searchItemTerm.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchItemTerm.toLowerCase()) ||
    item.company.toLowerCase().includes(searchItemTerm.toLowerCase())
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
    const pPrice = currentItem.pPrice || selectedItem.pPrice;
    const bonus = currentItem.bonus || 0;
    const amount = quantity * pPrice;

    const newItem: PurchaseItemType = {
      id: Date.now(),
      code: selectedItem.code,
      itemCode: selectedItem.itemCode,
      itemName: selectedItem.name,
      packing: selectedItem.packing,
      quantity,
      bonus,
      pPrice,
      amount,
      company: selectedItem.company
    };

    setPurchaseItems([...purchaseItems, newItem]);
    setCurrentItem({
      code: '',
      itemCode: '',
      quantity: 1,
      bonus: 0,
      pPrice: 0
    });
    setSearchItemTerm('');
  };

  const handleRemoveItem = (id: number) => {
    setPurchaseItems(purchaseItems.filter(item => item.id !== id));
  };

  const handleItemSelect = (item: any) => {
    setCurrentItem({
      ...currentItem,
      code: item.code,
      itemCode: item.itemCode,
      pPrice: item.pPrice
    });
    setSearchItemTerm(item.name);
  };

  const handleSupplierSelect = (supplier: any) => {
    setSelectedSupplier(supplier);
  };

  const handleSavePurchase = () => {
    if (purchaseItems.length === 0) {
      toast({
        title: "Error",
        description: "Cannot save an empty purchase. Please add items.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save the purchase to your database
    toast({
      title: "Purchase Saved",
      description: `Purchase ${invoiceNo} has been saved successfully.`,
    });

    // For demonstration, we'll just clear the form
    resetPurchase();
  };

  const resetPurchase = () => {
    setPurchaseItems([]);
    setCurrentItem({
      code: '',
      itemCode: '',
      quantity: 1,
      bonus: 0,
      pPrice: 0
    });
    setDiscountPercentage(0);
    setCashPaid(0);
    setSelectedSupplier(null);
    setInvoiceNo(`PUR-2024-${Math.floor(1000 + Math.random() * 9000)}`);
    setSupplierBillNo('');
    setBiltyNo('');
  };

  return (
    <PageContainer 
      title="Purchase" 
      subtitle="Record and manage product purchases from suppliers"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Purchase Header */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>New Purchase</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={resetPurchase}>
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
                <Button onClick={handleSavePurchase}>
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
                  <label htmlFor="supplierBillNo" className="block text-sm font-medium mb-1">Supplier Bill No</label>
                  <input
                    id="supplierBillNo"
                    type="text"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={supplierBillNo}
                    onChange={(e) => setSupplierBillNo(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="biltyNo" className="block text-sm font-medium mb-1">Bilty No</label>
                  <input
                    id="biltyNo"
                    type="text"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={biltyNo}
                    onChange={(e) => setBiltyNo(e.target.value)}
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
              </div>
              
              <div className="space-y-4 lg:col-span-2">
                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium mb-1">Supplier</label>
                  <div className="relative">
                    <input
                      id="supplier"
                      type="text"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      placeholder="Search supplier..."
                      value={selectedSupplier ? selectedSupplier.title : ''}
                      onChange={(e) => !selectedSupplier && e.target.value}
                    />
                    {!selectedSupplier && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {mockSuppliers.map(supplier => (
                          <div
                            key={supplier.id}
                            className="p-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSupplierSelect(supplier)}
                          >
                            <div className="font-medium">{supplier.title}</div>
                            <div className="text-sm text-muted-foreground">Balance: ${supplier.balance.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="discountPercentage" className="block text-sm font-medium mb-1">Discount %</label>
                    <input
                      id="discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cashPaid" className="block text-sm font-medium mb-1">Cash Paid</label>
                    <input
                      id="cashPaid"
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-2 rounded-md border border-input bg-background"
                      value={cashPaid}
                      onChange={(e) => setCashPaid(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Item Selection and Purchase Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Purchase Items</CardTitle>
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
                            Code: {item.itemCode} | Company: {item.company}
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
                <label htmlFor="pPrice" className="block text-sm font-medium mb-1">Purchase Price</label>
                <input
                  id="pPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={currentItem.pPrice}
                  onChange={(e) => setCurrentItem({...currentItem, pPrice: Number(e.target.value)})}
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
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Item Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Packing</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Quantity</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Bonus</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Company</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseItems.length > 0 ? (
                    purchaseItems.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-2 text-sm">{item.code}</td>
                        <td className="px-4 py-2 text-sm">{item.itemName}</td>
                        <td className="px-4 py-2 text-sm">{item.packing}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.bonus}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.pPrice.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.amount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">{item.company}</td>
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
                      <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                        <Warehouse className="h-8 w-8 mx-auto mb-2" />
                        No items added to the purchase yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Purchase Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Total Items:</div>
              <div className="text-sm font-semibold text-right">{totalItems}</div>
              
              <div className="text-sm text-muted-foreground">Gross Bill:</div>
              <div className="text-sm font-semibold text-right">${grossBillAmount.toFixed(2)}</div>
              
              <div className="text-sm text-muted-foreground">Discount Amount:</div>
              <div className="text-sm font-semibold text-right">${discountAmount.toFixed(2)}</div>
              
              <div className="text-sm text-muted-foreground">Net Bill Payable:</div>
              <div className="text-sm font-semibold text-right">${netBillPayable.toFixed(2)}</div>
              
              <div className="text-sm text-muted-foreground">Discount %:</div>
              <div className="text-sm font-semibold text-right">{discountPercentage}%</div>
              
              <div className="border-t border-border pt-2 text-sm text-muted-foreground">Previous Balance:</div>
              <div className="border-t border-border pt-2 text-sm font-semibold text-right">
                ${previousBalance.toFixed(2)}
              </div>
              
              <div className="text-sm text-muted-foreground">Cash Paid:</div>
              <div className="text-sm font-semibold text-right">${cashPaid.toFixed(2)}</div>
              
              <div className="pt-2 border-t border-border text-sm font-medium">Net Balance:</div>
              <div className="pt-2 border-t border-border text-sm font-bold text-right">
                ${netBalance.toFixed(2)}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full grid grid-cols-2 gap-2">
              <CustomButton variant="outline3D" className="w-full" asChild>
                <div className="flex flex-col items-center justify-center p-1">
                  <Filter className="h-4 w-4 mb-1" />
                  <span className="text-xs">Filter</span>
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
                  <span className="text-xs">Account</span>
                </div>
              </CustomButton>
              
              <CustomButton variant="outline3D" className="w-full" asChild>
                <div className="flex flex-col items-center justify-center p-1">
                  <FileText className="h-4 w-4 mb-1" />
                  <span className="text-xs">Find Bill</span>
                </div>
              </CustomButton>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Purchase;
