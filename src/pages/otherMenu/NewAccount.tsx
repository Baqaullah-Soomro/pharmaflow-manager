
import React, { useState, useEffect } from 'react';
import { Users, Filter, Save, Edit, FileText, Plus, Search } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';

// Mock data for account types
const accountTypes = ['Customer', 'Supplier', 'Employee', 'Expense', 'Income'];
const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];
const salesmen = ['Ahmed', 'Ali', 'Hassan', 'Usman', 'Imran'];
const areaHeads = ['North Region', 'South Region', 'East Region', 'West Region', 'Central'];

// Mock accounts data
const mockAccounts = [
  { id: 'ACC001', title: 'City Hospital', address: '123 Medical St', city: 'Lahore', area: 'North', phone: '042-35777123', cell: '0300-1234567', type: 'Customer', head: 'North Region', salesman: 'Ahmed' },
  { id: 'ACC002', title: 'Metro Pharmacy', address: '456 Health Ave', city: 'Karachi', area: 'South', phone: '021-35123456', cell: '0312-7654321', type: 'Customer', head: 'South Region', salesman: 'Ali' },
  { id: 'ACC003', title: 'MediSupply Co', address: '789 Supply Rd', city: 'Islamabad', area: 'Central', phone: '051-2345678', cell: '0333-9876543', type: 'Supplier', head: 'Central', salesman: 'Hassan' },
  { id: 'ACC004', title: 'Sunrise Clinic', address: '321 Sunrise Blvd', city: 'Rawalpindi', area: 'East', phone: '051-5432167', cell: '0321-5678901', type: 'Customer', head: 'East Region', salesman: 'Usman' },
  { id: 'ACC005', title: 'Healthcare Solutions', address: '654 Solution St', city: 'Faisalabad', area: 'West', phone: '041-8765432', cell: '0345-1234567', type: 'Supplier', head: 'West Region', salesman: 'Imran' },
];

const NewAccount = () => {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [filteredAccounts, setFilteredAccounts] = useState(mockAccounts);
  
  // Form state
  const [accountNo, setAccountNo] = useState('');
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [type, setType] = useState('');
  const [head, setHead] = useState('');
  const [salesman, setSalesman] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState('');
  
  // Filter state
  const [filterTitle, setFilterTitle] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Generate new account number
  useEffect(() => {
    if (!isEditing) {
      const newAccountNo = `ACC${String(accounts.length + 1).padStart(3, '0')}`;
      setAccountNo(newAccountNo);
    }
  }, [accounts, isEditing]);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...accounts];
    
    if (filterTitle) {
      filtered = filtered.filter(account => 
        account.title.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }
    
    if (filterCity) {
      filtered = filtered.filter(account => account.city === filterCity);
    }
    
    if (filterType) {
      filtered = filtered.filter(account => account.type === filterType);
    }
    
    setFilteredAccounts(filtered);
  }, [accounts, filterTitle, filterCity, filterType]);
  
  const handleSave = () => {
    if (!title || !type) {
      alert('Title and Type are required');
      return;
    }
    
    const newAccount = {
      id: accountNo,
      title,
      address,
      city: cityArea.split(' ')[0] || '',
      area: cityArea.split(' ')[1] || '',
      phone: phoneNo,
      cell: cellPhone,
      type,
      head,
      salesman
    };
    
    if (isEditing) {
      // Update existing account
      setAccounts(accounts.map(account => 
        account.id === currentAccountId ? newAccount : account
      ));
      setIsEditing(false);
    } else {
      // Add new account
      setAccounts([...accounts, newAccount]);
    }
    
    // Reset form
    resetForm();
  };
  
  const handleEdit = (id: string) => {
    const accountToEdit = accounts.find(account => account.id === id);
    if (accountToEdit) {
      setAccountNo(accountToEdit.id);
      setTitle(accountToEdit.title);
      setAddress(accountToEdit.address);
      setCityArea(`${accountToEdit.city} ${accountToEdit.area}`);
      setPhoneNo(accountToEdit.phone);
      setCellPhone(accountToEdit.cell);
      setType(accountToEdit.type);
      setHead(accountToEdit.head);
      setSalesman(accountToEdit.salesman);
      setIsEditing(true);
      setCurrentAccountId(id);
    }
  };
  
  const handleNew = () => {
    resetForm();
    setIsEditing(false);
  };
  
  const resetForm = () => {
    const newAccountNo = `ACC${String(accounts.length + 1).padStart(3, '0')}`;
    setAccountNo(newAccountNo);
    setTitle('');
    setAddress('');
    setCityArea('');
    setPhoneNo('');
    setCellPhone('');
    setType('');
    setHead('');
    setSalesman('');
    setCurrentAccountId('');
  };
  
  const handleLedger = (id: string) => {
    console.log('View ledger for account:', id);
    alert(`Ledger account for ${id} would be displayed here`);
  };
  
  return (
    <PageContainer 
      title="New Account" 
      subtitle="Create and manage customer, supplier, and other accounts"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Account Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Account' : 'New Account'}</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Update account information' 
                : 'Fill in the details to create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="accountNo" className="block text-sm font-medium mb-1">Account No</label>
              <input
                id="accountNo"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-muted"
                value={accountNo}
                readOnly
              />
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
              <input
                id="title"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
              <input
                id="address"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="cityArea" className="block text-sm font-medium mb-1">City/Area</label>
              <input
                id="cityArea"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={cityArea}
                onChange={(e) => setCityArea(e.target.value)}
                placeholder="e.g. Lahore North"
              />
            </div>
            
            <div>
              <label htmlFor="phoneNo" className="block text-sm font-medium mb-1">Phone No</label>
              <input
                id="phoneNo"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="cellPhone" className="block text-sm font-medium mb-1">Cell Phone</label>
              <input
                id="cellPhone"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={cellPhone}
                onChange={(e) => setCellPhone(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">Type *</label>
              <select
                id="type"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">-- Select Type --</option>
                {accountTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="head" className="block text-sm font-medium mb-1">Head</label>
              <select
                id="head"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={head}
                onChange={(e) => setHead(e.target.value)}
              >
                <option value="">-- Select Head --</option>
                {areaHeads.map((head, index) => (
                  <option key={index} value={head}>{head}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="salesman" className="block text-sm font-medium mb-1">Salesman</label>
              <select
                id="salesman"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={salesman}
                onChange={(e) => setSalesman(e.target.value)}
              >
                <option value="">-- Select Salesman --</option>
                {salesmen.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2">
              <CustomButton 
                onClick={handleNew} 
                variant="outline3D"
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </CustomButton>
              
              <CustomButton 
                onClick={handleSave} 
                variant="premium"
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </CustomButton>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Filters and Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account List</CardTitle>
            <CardDescription>View and manage all accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="filterTitle" className="block text-sm font-medium mb-1">Title</label>
                <SearchInput
                  value={filterTitle}
                  onChange={setFilterTitle}
                  placeholder="Search by title..."
                />
              </div>
              
              <div>
                <label htmlFor="filterCity" className="block text-sm font-medium mb-1">City</label>
                <select
                  id="filterCity"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="filterType" className="block text-sm font-medium mb-1">Type</label>
                <select
                  id="filterType"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {accountTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Accounts Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left">Account ID</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">City</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Area Head</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account, index) => (
                      <tr key={account.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-4 py-2">{account.id}</td>
                        <td className="px-4 py-2">{account.title}</td>
                        <td className="px-4 py-2">{account.city}</td>
                        <td className="px-4 py-2">{account.type}</td>
                        <td className="px-4 py-2">{account.head}</td>
                        <td className="px-4 py-2 flex justify-center space-x-2">
                          <CustomButton 
                            onClick={() => handleEdit(account.id)} 
                            variant="outline3D"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </CustomButton>
                          <CustomButton 
                            onClick={() => handleLedger(account.id)} 
                            variant="outline3D"
                            size="sm"
                          >
                            <FileText className="h-4 w-4" />
                          </CustomButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                        No accounts found
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

export default NewAccount;
