
import React, { useState } from 'react';
import { UserPlus, User, Save, Edit, Trash2, Search, Award } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import SearchInput from '@/components/ui/SearchInput';

// Mock data for sales persons
const mockSalesPersons = [
  { id: 'SP001', name: 'John Smith', fatherName: 'Robert Smith', address: '123 Sales St', city: 'New York', phone: '212-555-7890', cellPhone: '917-555-4321' },
  { id: 'SP002', name: 'Sarah Johnson', fatherName: 'Michael Johnson', address: '456 Marketing Ave', city: 'Chicago', phone: '312-555-9876', cellPhone: '773-555-6543' },
  { id: 'SP003', name: 'David Lee', fatherName: 'James Lee', address: '789 Commerce Rd', city: 'Los Angeles', phone: '213-555-2345', cellPhone: '323-555-7654' },
  { id: 'SP004', name: 'Maria Garcia', fatherName: 'Carlos Garcia', address: '101 Distribution Ln', city: 'Miami', phone: '305-555-8765', cellPhone: '786-555-3456' },
];

// Cities
const cities = ['New York', 'Chicago', 'Los Angeles', 'Miami', 'Dallas', 'Boston', 'Seattle', 'Philadelphia'];

const SalesPerson = () => {
  const [salesPersons, setSalesPersons] = useState(mockSalesPersons);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentSalesPerson, setCurrentSalesPerson] = useState({
    id: '',
    name: '',
    fatherName: '',
    address: '',
    city: '',
    phone: '',
    cellPhone: ''
  });
  
  const { toast } = useToast();

  // Filter sales persons based on search
  const filteredSalesPersons = salesPersons.filter(person =>
    person.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setCurrentSalesPerson({
      id: '',
      name: '',
      fatherName: '',
      address: '',
      city: '',
      phone: '',
      cellPhone: ''
    });
    setFormMode('add');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentSalesPerson(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSalesPerson.id || !currentSalesPerson.name) {
      toast({
        title: "Required Fields Missing",
        description: "Sales Person ID and Name are required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (formMode === 'add') {
      // Check if ID already exists
      if (salesPersons.some(person => person.id === currentSalesPerson.id)) {
        toast({
          title: "Duplicate ID",
          description: "A sales person with this ID already exists.",
          variant: "destructive"
        });
        return;
      }
      
      // Add new sales person
      setSalesPersons([...salesPersons, currentSalesPerson]);
      toast({
        title: "Sales Person Added",
        description: `${currentSalesPerson.name} has been added successfully.`
      });
    } else {
      // Update existing sales person
      setSalesPersons(salesPersons.map(person => 
        person.id === currentSalesPerson.id ? currentSalesPerson : person
      ));
      toast({
        title: "Sales Person Updated",
        description: `${currentSalesPerson.name}'s information has been updated successfully.`
      });
    }
    
    resetForm();
  };

  const handleEdit = (person: typeof currentSalesPerson) => {
    setCurrentSalesPerson(person);
    setFormMode('edit');
  };

  const handleDelete = (id: string) => {
    setSalesPersons(salesPersons.filter(person => person.id !== id));
    toast({
      title: "Sales Person Deleted",
      description: "The sales person has been removed successfully.",
      variant: "destructive"
    });
  };

  return (
    <PageContainer
      title="Sales Person"
      subtitle="Manage your sales team personnel"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Person Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {formMode === 'add' ? 'Add Sales Person' : 'Edit Sales Person'}
              </CardTitle>
              <CardDescription>
                {formMode === 'add' 
                  ? 'Create a new sales team member' 
                  : `Editing ${currentSalesPerson.name}'s information`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Sales Person ID</Label>
                    <Input
                      id="id"
                      name="id"
                      value={currentSalesPerson.id}
                      onChange={handleInputChange}
                      placeholder="e.g., SP001"
                      readOnly={formMode === 'edit'}
                      className={formMode === 'edit' ? 'bg-muted' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={currentSalesPerson.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      value={currentSalesPerson.fatherName}
                      onChange={handleInputChange}
                      placeholder="Father's Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={currentSalesPerson.address}
                      onChange={handleInputChange}
                      placeholder="Full Address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <select
                      id="city"
                      name="city"
                      value={currentSalesPerson.city}
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
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={currentSalesPerson.phone}
                      onChange={handleInputChange}
                      placeholder="Office Phone"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cellPhone">Cell Phone</Label>
                    <Input
                      id="cellPhone"
                      name="cellPhone"
                      value={currentSalesPerson.cellPhone}
                      onChange={handleInputChange}
                      placeholder="Mobile Number"
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
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Person
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Person
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Sales Persons List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sales Team Directory
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetForm}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  New Person
                </Button>
              </div>
              <CardDescription>
                Search and manage your sales team members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by ID, name or city..."
              />
              
              {/* Sales Persons Table */}
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Father's Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">City</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cell Phone</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalesPersons.length > 0 ? (
                      filteredSalesPersons.map((person, index) => (
                        <tr 
                          key={person.id} 
                          className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                        >
                          <td className="px-4 py-3 text-sm">{person.id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{person.name}</td>
                          <td className="px-4 py-3 text-sm">{person.fatherName}</td>
                          <td className="px-4 py-3 text-sm">{person.city}</td>
                          <td className="px-4 py-3 text-sm">{person.cellPhone}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(person)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(person.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          <Search className="mx-auto h-8 w-8 mb-2 opacity-20" />
                          {searchTerm ? 
                            'No sales persons match your search criteria' : 
                            'No sales persons have been added yet'}
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

export default SalesPerson;
