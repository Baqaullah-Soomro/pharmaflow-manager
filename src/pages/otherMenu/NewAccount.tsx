
import React, { useState } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomButton } from '@/components/ui/CustomButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Users, Edit, Save, FileText, Plus, Filter } from 'lucide-react';
import SearchInput from '@/components/ui/SearchInput';

// Mock data
const mockAccounts = [
  { id: 'AC001', title: 'ABC Pharmacy', city: 'New York', type: 'Customer', area: 'Downtown', head: 'John Smith' },
  { id: 'AC002', title: 'XYZ Medical Supplies', city: 'Chicago', type: 'Supplier', area: 'Business District', head: 'Sarah Johnson' },
  { id: 'AC003', title: 'Health Plus', city: 'Boston', type: 'Customer', area: 'North End', head: 'Mike Brown' },
  { id: 'AC004', title: 'Medical Wholesale Ltd', city: 'Miami', type: 'Supplier', area: 'Brickell', head: 'Lisa Garcia' },
  { id: 'AC005', title: 'City Clinic', city: 'Seattle', type: 'Customer', area: 'Downtown', head: 'David Wilson' },
];

const cities = ['New York', 'Chicago', 'Boston', 'Miami', 'Seattle', 'San Francisco', 'Los Angeles'];
const areas = ['Downtown', 'Business District', 'North End', 'Brickell', 'Financial District', 'Uptown'];
const accountTypes = ['Customer', 'Supplier', 'Employee', 'Expense', 'Income'];
const salesmen = ['John Smith', 'Sarah Johnson', 'Mike Brown', 'Lisa Garcia', 'David Wilson'];

const NewAccount = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('new');
  const [accounts, setAccounts] = useState(mockAccounts);
  const [newAccountId, setNewAccountId] = useState('AC006');
  
  // Form state
  const [formData, setFormData] = useState({
    accountNo: newAccountId,
    title: '',
    address: '',
    city: '',
    area: '',
    phoneNo: '',
    cellPhone: '',
    type: '',
    head: '',
    salesman: ''
  });

  // Filter state
  const [filters, setFilters] = useState({
    title: '',
    city: '',
    type: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, title: value }));
  };

  const saveAccount = () => {
    // Validation
    if (!formData.title || !formData.type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Add new account to list
    const newAccount = {
      id: formData.accountNo,
      title: formData.title,
      city: formData.city,
      type: formData.type,
      area: formData.area,
      head: formData.head
    };

    setAccounts(prev => [...prev, newAccount]);
    
    // Generate next account ID
    const nextId = `AC${String(parseInt(newAccountId.replace('AC', '')) + 1).padStart(3, '0')}`;
    setNewAccountId(nextId);
    
    // Reset form
    setFormData({
      accountNo: nextId,
      title: '',
      address: '',
      city: '',
      area: '',
      phoneNo: '',
      cellPhone: '',
      type: '',
      head: '',
      salesman: ''
    });

    toast({
      title: "Account Created",
      description: "New account has been successfully created."
    });
  };

  const showLedger = () => {
    toast({
      title: "Ledger Account",
      description: "Ledger account view will be displayed here.",
    });
  };

  const editAccount = () => {
    setActiveTab('new');
    toast({
      title: "Edit Account",
      description: "Edit mode activated. Make changes and save."
    });
  };

  // Filter accounts based on filters
  const filteredAccounts = accounts.filter(account => {
    return (
      (filters.title === '' || account.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.city === '' || account.city === filters.city) &&
      (filters.type === '' || account.type === filters.type)
    );
  });

  return (
    <PageContainer 
      title="Account Management" 
      subtitle="Create and manage customer and supplier accounts"
    >
      <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="new">Create Account</TabsTrigger>
          <TabsTrigger value="list">Account List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {formData.accountNo ? `Account #${formData.accountNo}` : 'New Account'}
              </CardTitle>
              <CardDescription>
                Enter account details below to create a new account or edit existing one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountNo">Account No</Label>
                    <Input 
                      id="accountNo" 
                      name="accountNo" 
                      value={formData.accountNo} 
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      placeholder="Account title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange}
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleSelectChange('city', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Select
                      value={formData.area}
                      onValueChange={(value) => handleSelectChange('area', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNo">Phone No</Label>
                    <Input 
                      id="phoneNo" 
                      name="phoneNo" 
                      value={formData.phoneNo} 
                      onChange={handleInputChange}
                      placeholder="Office phone"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cellPhone">Cell Phone</Label>
                    <Input 
                      id="cellPhone" 
                      name="cellPhone" 
                      value={formData.cellPhone} 
                      onChange={handleInputChange}
                      placeholder="Mobile number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="head">Head</Label>
                    <Input 
                      id="head" 
                      name="head" 
                      value={formData.head} 
                      onChange={handleInputChange}
                      placeholder="Department head"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salesman">Salesman</Label>
                    <Select
                      value={formData.salesman}
                      onValueChange={(value) => handleSelectChange('salesman', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Assign salesperson" />
                      </SelectTrigger>
                      <SelectContent>
                        {salesmen.map(person => (
                          <SelectItem key={person} value={person}>{person}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-8 justify-end">
                <CustomButton
                  variant="outline3D"
                  onClick={() => {
                    setFormData({
                      accountNo: newAccountId,
                      title: '',
                      address: '',
                      city: '',
                      area: '',
                      phoneNo: '',
                      cellPhone: '',
                      type: '',
                      head: '',
                      salesman: ''
                    });
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New
                </CustomButton>
                
                <CustomButton
                  variant="outline3D"
                  onClick={editAccount}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </CustomButton>
                
                <CustomButton
                  onClick={saveAccount}
                >
                  <Save className="h-4 w-4" />
                  Save
                </CustomButton>
                
                <CustomButton
                  variant="outline3D"
                  onClick={showLedger}
                >
                  <FileText className="h-4 w-4" />
                  Ledger A/C
                </CustomButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Account List
              </CardTitle>
              <CardDescription>
                View and manage all accounts in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <SearchInput 
                      value={filters.title} 
                      onChange={handleSearchChange} 
                      placeholder="Search by title..."
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
                    <Select
                      value={filters.city}
                      onValueChange={(value) => handleFilterChange('city', value)}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Cities</SelectItem>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={filters.type}
                      onValueChange={(value) => handleFilterChange('type', value)}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        {accountTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Head</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccounts.length > 0 ? (
                        filteredAccounts.map((account) => (
                          <TableRow key={account.id}>
                            <TableCell>{account.id}</TableCell>
                            <TableCell>{account.title}</TableCell>
                            <TableCell>{account.city}</TableCell>
                            <TableCell>{account.type}</TableCell>
                            <TableCell>{account.area}</TableCell>
                            <TableCell>{account.head}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <CustomButton
                                  size="sm"
                                  variant="outline3D"
                                  onClick={editAccount}
                                >
                                  <Edit className="h-4 w-4" />
                                </CustomButton>
                                <CustomButton
                                  size="sm"
                                  variant="outline3D"
                                  onClick={showLedger}
                                >
                                  <FileText className="h-4 w-4" />
                                </CustomButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No accounts found matching the current filters
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default NewAccount;
