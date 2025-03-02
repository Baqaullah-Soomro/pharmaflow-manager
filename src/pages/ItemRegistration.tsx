
import React, { useState } from 'react';
import { Plus, Save, Edit, Trash2, Package, FileSearch } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';
import { useToast } from '@/components/ui/use-toast';

// Mock data for demonstration purposes
const mockItems = [
  { id: 1, code: 'MD001', itemCode: 'IC001', company: 'MediTech', name: 'Surgical Gloves', packing: '100/box', pPrice: 35.50, sPrice: 45.99 },
  { id: 2, code: 'MD002', itemCode: 'IC002', company: 'PharmaPlus', name: 'Digital Thermometer', packing: '1/unit', pPrice: 78.25, sPrice: 89.99 },
  { id: 3, code: 'MD003', itemCode: 'IC003', company: 'HealthFirst', name: 'Bandages (Premium)', packing: '50/pack', pPrice: 28.75, sPrice: 34.50 },
  { id: 4, code: 'MD004', itemCode: 'IC004', company: 'CleanMed', name: 'Disinfectant Solution', packing: '500ml', pPrice: 52.00, sPrice: 62.25 },
  { id: 5, code: 'MD005', itemCode: 'IC005', company: 'PharmaPlus', name: 'Penicillin Injection', packing: '10/pack', pPrice: 110.50, sPrice: 124.99 },
];

interface ItemType {
  id: number;
  code: string;
  itemCode: string;
  company: string;
  name: string;
  packing: string;
  pPrice: number;
  sPrice: number;
}

const ItemRegistration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<ItemType[]>(mockItems);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentItem, setCurrentItem] = useState<ItemType>({
    id: 0,
    code: '',
    itemCode: '',
    company: '',
    name: '',
    packing: '',
    pPrice: 0,
    sPrice: 0
  });
  
  const { toast } = useToast();

  // Filter items based on search
  const filteredItems = items.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.code.toLowerCase().includes(searchLower) ||
      item.itemCode.toLowerCase().includes(searchLower) ||
      item.company.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: name === 'pPrice' || name === 'sPrice' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setCurrentItem({
      id: 0,
      code: '',
      itemCode: '',
      company: '',
      name: '',
      packing: '',
      pPrice: 0,
      sPrice: 0
    });
    setFormMode('add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'add') {
      // Add new item
      const newItem = {
        ...currentItem,
        id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1
      };
      
      setItems([...items, newItem]);
      toast({
        title: "Item Added",
        description: `${newItem.name} has been added to the inventory.`,
      });
    } else {
      // Update existing item
      setItems(items.map(item => item.id === currentItem.id ? currentItem : item));
      toast({
        title: "Item Updated",
        description: `${currentItem.name} has been updated successfully.`,
      });
    }
    
    resetForm();
  };

  const handleEdit = (item: ItemType) => {
    setCurrentItem(item);
    setFormMode('edit');
  };

  const handleDelete = (id: number) => {
    const itemToDelete = items.find(item => item.id === id);
    setItems(items.filter(item => item.id !== id));
    
    toast({
      title: "Item Deleted",
      description: `${itemToDelete?.name} has been removed from the inventory.`,
      variant: "destructive"
    });
  };

  // Get unique companies for dropdown
  const companies = [...new Set(items.map(item => item.company))];

  return (
    <PageContainer 
      title="Item Registration" 
      subtitle="Register and manage your medical inventory items"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Item Registration Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{formMode === 'add' ? 'Add New Item' : 'Edit Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium mb-1">Code</label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={currentItem.code}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="itemCode" className="block text-sm font-medium mb-1">Item Code</label>
                  <input
                    id="itemCode"
                    name="itemCode"
                    type="text"
                    required
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={currentItem.itemCode}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                  <select
                    id="company"
                    name="company"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={currentItem.company}
                    onChange={handleSelectChange}
                  >
                    <option value="">Select Company</option>
                    {companies.map((company, index) => (
                      <option key={index} value={company}>{company}</option>
                    ))}
                    <option value="newCompany">+ Add New Company</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Item Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={currentItem.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="packing" className="block text-sm font-medium mb-1">Packing</label>
                  <input
                    id="packing"
                    name="packing"
                    type="text"
                    required
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={currentItem.packing}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="pPrice" className="block text-sm font-medium mb-1">Purchase Price</label>
                  <input
                    id="pPrice"
                    name="pPrice"
                    type="number"
                    step="0.01"
                    required
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={currentItem.pPrice}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="sPrice" className="block text-sm font-medium mb-1">Sale Price</label>
                  <input
                    id="sPrice"
                    name="sPrice"
                    type="number"
                    step="0.01"
                    required
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={currentItem.sPrice}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    {formMode === 'add' ? (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Item
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
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Items List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Item Inventory</CardTitle>
              <CustomButton variant="premium" size="sm" onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                New Item
              </CustomButton>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <SearchInput 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by code, item name or company..."
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Item Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Item Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Packing</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Purchase Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Sale Price</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm">{item.code}</td>
                        <td className="px-4 py-3 text-sm">{item.itemCode}</td>
                        <td className="px-4 py-3 text-sm">{item.company}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                            {item.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.packing}</td>
                        <td className="px-4 py-3 text-sm text-right">${item.pPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right">${item.sPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center justify-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        <FileSearch className="h-8 w-8 mx-auto mb-2" />
                        {searchTerm ? 'No items match your search criteria' : 'No items have been added yet'}
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

export default ItemRegistration;
