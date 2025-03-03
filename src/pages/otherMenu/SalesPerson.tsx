
import React, { useState } from 'react';
import { UserPlus, Save, Edit, Trash, Plus } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';

// Mock data for cities
const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];

// Mock data for salespeople
const mockSalespeople = [
  { id: 'SP001', name: 'Ahmed Khan', fatherName: 'Tariq Khan', address: '123 Sales St, Block A', city: 'Lahore', phone: '042-35777123', cellPhone: '0300-1234567' },
  { id: 'SP002', name: 'Sara Ali', fatherName: 'Kamran Ali', address: '456 Marketing Ave, Phase 2', city: 'Karachi', phone: '021-35123456', cellPhone: '0312-7654321' },
  { id: 'SP003', name: 'Usman Ahmad', fatherName: 'Bilal Ahmad', address: '789 Commerce Rd, Sector F', city: 'Islamabad', phone: '051-2345678', cellPhone: '0333-9876543' },
  { id: 'SP004', name: 'Fatima Hassan', fatherName: 'Hassan Raza', address: '321 Enterprise Blvd, Scheme 3', city: 'Rawalpindi', phone: '051-5432167', cellPhone: '0321-5678901' },
];

const SalesPerson = () => {
  const [salespeople, setSalespeople] = useState(mockSalespeople);
  const [filteredSalespeople, setFilteredSalespeople] = useState(mockSalespeople);
  
  // Form state
  const [personId, setPersonId] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPersonId, setCurrentPersonId] = useState('');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Generate new salesperson ID
  React.useEffect(() => {
    if (!isEditing) {
      const newPersonId = `SP${String(salespeople.length + 1).padStart(3, '0')}`;
      setPersonId(newPersonId);
    }
  }, [salespeople, isEditing]);
  
  // Filter salespeople based on search term
  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSalespeople(salespeople);
    } else {
      const filtered = salespeople.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSalespeople(filtered);
    }
  }, [salespeople, searchTerm]);
  
  const handleSave = () => {
    if (!name || !city) {
      alert('Name and City are required');
      return;
    }
    
    const newPerson = {
      id: personId,
      name,
      fatherName,
      address,
      city,
      phone,
      cellPhone
    };
    
    if (isEditing) {
      // Update existing salesperson
      setSalespeople(salespeople.map(person => 
        person.id === currentPersonId ? newPerson : person
      ));
      setIsEditing(false);
    } else {
      // Add new salesperson
      setSalespeople([...salespeople, newPerson]);
    }
    
    // Reset form
    resetForm();
  };
  
  const handleEdit = (id: string) => {
    const personToEdit = salespeople.find(person => person.id === id);
    if (personToEdit) {
      setPersonId(personToEdit.id);
      setName(personToEdit.name);
      setFatherName(personToEdit.fatherName);
      setAddress(personToEdit.address);
      setCity(personToEdit.city);
      setPhone(personToEdit.phone);
      setCellPhone(personToEdit.cellPhone);
      setIsEditing(true);
      setCurrentPersonId(id);
    }
  };
  
  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this salesperson?');
    if (confirmDelete) {
      setSalespeople(salespeople.filter(person => person.id !== id));
      if (currentPersonId === id) {
        resetForm();
      }
    }
  };
  
  const handleNew = () => {
    resetForm();
    setIsEditing(false);
  };
  
  const resetForm = () => {
    const newPersonId = `SP${String(salespeople.length + 1).padStart(3, '0')}`;
    setPersonId(newPersonId);
    setName('');
    setFatherName('');
    setAddress('');
    setCity('');
    setPhone('');
    setCellPhone('');
    setCurrentPersonId('');
  };
  
  return (
    <PageContainer 
      title="Sales Person" 
      subtitle="Manage your sales team personnel"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Person Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Sales Person' : 'New Sales Person'}</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Update sales person information' 
                : 'Fill in the details to create a new sales person'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="personId" className="block text-sm font-medium mb-1">Sales Person ID</label>
              <input
                id="personId"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-muted"
                value={personId}
                readOnly
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
              <input
                id="name"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="fatherName" className="block text-sm font-medium mb-1">Father's Name</label>
              <input
                id="fatherName"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
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
              <label htmlFor="city" className="block text-sm font-medium mb-1">City *</label>
              <select
                id="city"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="">-- Select City --</option>
                {cities.map((cityOption, index) => (
                  <option key={index} value={cityOption}>{cityOption}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
              <input
                id="phone"
                type="text"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
        
        {/* Sales Person Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Team</CardTitle>
            <CardDescription>View and manage your sales team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name, ID or city..."
              className="mb-4"
            />
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Father's Name</th>
                    <th className="px-4 py-2 text-left">City</th>
                    <th className="px-4 py-2 text-left">Cell Phone</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalespeople.length > 0 ? (
                    filteredSalespeople.map((person, index) => (
                      <tr key={person.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-4 py-2">{person.id}</td>
                        <td className="px-4 py-2">{person.name}</td>
                        <td className="px-4 py-2">{person.fatherName}</td>
                        <td className="px-4 py-2">{person.city}</td>
                        <td className="px-4 py-2">{person.cellPhone}</td>
                        <td className="px-4 py-2 flex justify-center space-x-2">
                          <CustomButton 
                            onClick={() => handleEdit(person.id)} 
                            variant="outline3D"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </CustomButton>
                          <CustomButton 
                            onClick={() => handleDelete(person.id)} 
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
                      <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                        No sales personnel found
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

export default SalesPerson;
