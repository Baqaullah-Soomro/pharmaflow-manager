
import React, { useState } from 'react';
import { Users, Plus, Save, FileText, Edit, Trash2, Filter, Search } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import SearchInput from '@/components/ui/SearchInput';

// Mock data for accounts
const mockAccounts = [
  { id: 'ACC001', title: 'City Hospital', address: '123 Medical Ave', city: 'New York', area: 'Manhattan', phone: '212-555-1234', cellPhone: '917-555-6789', type: 'Hospital', head: 'Dr. Smith', salesman: 'John Doe' },
  { id: 'ACC002', title: 'Metro Pharmacy', address: '456 Health St', city: 'Boston', area: 'Downtown', phone: '617-555-2345', cellPhone: '857-555-7890', type: 'Pharmacy', head: 'Ms. Johnson', salesman: 'Jane Smith' },
  { id: 'ACC003', title: 'County Clinic', address: '789 Care Rd', city: 'Chicago', area: 'North Side', phone: '312-555-3456', cellPhone: '773-555-8901', type: 'Clinic', head: 'Dr. Williams', salesman: 'David Brown' },
  { id: 'ACC004', title: 'Wellness Center', address: '101 Healing Blvd', city: 'Miami', area: 'South Beach', phone: '305-555-4567', cellPhone: '786-555-9012', type: 'Wellness', head: 'Dr. Garcia', salesman: 'Michael Johnson' },
  { id: 'ACC005', title: 'Community Hospital', address: '202 Care Lane', city: 'Los Angeles', area: 'Downtown', phone: '213-555-5678', cellPhone: '323-555-0123', type: 'Hospital', head: 'Dr. Chen', salesman: 'Robert Lee' },
];

// Account types
const accountTypes = ['Hospital', 'Pharmacy', 'Clinic', 'Wellness', 'Laboratory', 'Doctor', 'Other'];

// Cities
const cities = ['New York', 'Boston', 'Chicago', 'Miami', 'Los Angeles', 'San Francisco', 'Dallas', 'Seattle'];

const NewAccount = () => {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const [currentAccount, setCurrentAccount] = useState({
    id: '',
    title: '',
    address: '',
    city: '',
    area: '',
    phone: '',
    cellPhone: '',
    type: '',
    head: '',
    salesman: ''
  });
  
  const { toast } = useToast();

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTitle = !filterTitle || account.title.toLowerCase().includes(filterTitle.toLowerCase());
    const matchesCity = !filterCity || account.city === filterCity;
    const matchesType = !filterType || account.type === filterType;
    
    return matchesSearch && matchesTitle && matchesCity && matchesType;
  });

  const resetForm = () => {
    setCurrentAccount({
      id: '',
      title: '',
      address: '',
      city: '',
      area: '',
      phone: '',
      cellPhone: '',
      type: '',
      head: '',
      salesman: ''
    });
    setFormMode('add');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount.id || !currentAccount.title) {
      toast({
        title: "Required Fields Missing",
        description: "Account No and Title are required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (formMode === 'add') {
      // Check if ID already exists
      if (accounts.some(acc => acc.id === currentAccount.id)) {
        toast({
          title: "Duplicate Account ID",
          description: "An account with this ID already exists.",
          variant: "destructive"
        });
        return;
      }
      
      // Add new account
      setAccounts([...accounts, currentAccount]);
      toast({
        title: "Account Created",
        description: `Account "${currentAccount.title}" has been created successfully.`
      });
    } else {
      // Update existing account
      setAccounts(accounts.map(acc => 
        acc.id === currentAccount.id ? currentAccount : acc
      ));
      toast({
        title: "Account Updated",
        description: `Account "${currentAccount.title}" has been updated successfully.`
      });
    }
    
    resetForm();
  };

  const handleEdit = (account: typeof currentAccount) => {
    setCurrentAccount(account);
    setFormMode('edit');
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
    toast({
      title: "Account Deleted",
      description: "The account has been removed successfully.",
      variant: "destructive"
    });
  };

  const handleViewLedger = (id: string) => {
    const account = accounts.find(acc => acc.id === id);
    toast({
      title: "Ledger Account",
      description: `Viewing ledger for ${account?.title}. This would display the full transaction history.`,
    });
  };

  return (
    <PageContainer
      title="New Account"
      subtitle="Create and manage vendor and customer accounts"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {formMode === 'add' ? 'Create New Account' : 'Edit Account'}
              </CardTitle>
              <CardDescription>
                {formMode === 'add' 
                  ? 'Add a new vendor or customer account' 
                  : `Editing account ${currentAccount.id}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Account No</Label>
                    <Input
                      id="id"
                      name="id"
                      value={currentAccount.id}
                      onChange={handleInputChange}
                      placeholder="e.g., ACC123"
                      readOnly={formMode === 'edit'}
                      className={formMode === 'edit' ? 'bg-muted' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={currentAccount.title}
                      onChange={handleInputChange}
                      placeholder="Account Title"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={currentAccount.address}
                    onChange={handleInputChange}
                    placeholder="Full Address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <select
                      id="city"
                      name="city"
                      value={currentAccount.city}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      name="area"
                      value={currentAccount.area}
                      onChange={handleInputChange}
                      placeholder="Area/District"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone No</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={currentAccount.phone}
                      onChange={handleInputChange}
                      placeholder="Office Phone"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cellPhone">Cell Phone</Label>
                    <Input
                      id="cellPhone"
                      name="cellPhone"
                      value={currentAccount.cellPhone}
                      onChange={handleInputChange}
                      placeholder="Mobile Number"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      name="type"
                      value={currentAccount.type}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    >
                      <option value="">Select Type</option>
                      {accountTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="head">Head</Label>
                    <Input
                      id="head"
                      name="head"
                      value={currentAccount.head}
                      onChange={handleInputChange}
                      placeholder="Head Person"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salesman">Salesman</Label>
                    <Input
                      id="salesman"
                      name="salesman"
                      value={currentAccount.salesman}
                      onChange={handleInputChange}
                      placeholder="Assigned Salesman"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                {formMode === 'add' ? 'Clear' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleSubmit}
              >
                {formMode === 'add' ? (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Account
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Accounts List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Account Directory
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetForm}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Account
                </Button>
              </div>
              <CardDescription>
                Search and manage your accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search by ID or title..."
                  className="md:w-1/3"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:w-2/3">
                  <Input
                    placeholder="Filter by title"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                  />
                  
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="p-2 rounded-md border border-input bg-background"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="p-2 rounded-md border border-input bg-background"
                  >
                    <option value="">All Types</option>
                    {accountTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Accounts Table */}
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Account ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">City</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Area Head</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((account, index) => (
                        <tr 
                          key={account.id} 
                          className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                        >
                          <td className="px-4 py-3 text-sm">{account.id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{account.title}</td>
                          <td className="px-4 py-3 text-sm">{account.city}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              account.type === 'Hospital' ? 'bg-blue-100 text-blue-800' :
                              account.type === 'Pharmacy' ? 'bg-green-100 text-green-800' :
                              account.type === 'Clinic' ? 'bg-purple-100 text-purple-800' :
                              account.type === 'Wellness' ? 'bg-amber-100 text-amber-800' :
                              account.type === 'Laboratory' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {account.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{account.head}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(account)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(account.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewLedger(account.id)}
                                title="Ledger Account"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          <Search className="mx-auto h-8 w-8 mb-2 opacity-20" />
                          {searchTerm || filterTitle || filterCity || filterType ? 
                            'No accounts match your search criteria' : 
                            'No accounts have been added yet'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default NewAccount;
