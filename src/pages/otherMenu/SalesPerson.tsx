
import React, { useState } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomButton } from '@/components/ui/CustomButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Save, Edit, Trash2, Plus } from 'lucide-react';
import SearchInput from '@/components/ui/SearchInput';

// Mock data
const mockSalesPeople = [
  { id: 'SP001', name: 'John Smith', fatherName: 'Robert Smith', address: '123 Main St', city: 'New York', phone: '212-555-1234', cellPhone: '917-555-1234' },
  { id: 'SP002', name: 'Sarah Johnson', fatherName: 'William Johnson', address: '456 Oak Ave', city: 'Chicago', phone: '312-555-5678', cellPhone: '773-555-5678' },
  { id: 'SP003', name: 'Mike Brown', fatherName: 'James Brown', address: '789 Pine Blvd', city: 'Boston', phone: '617-555-9012', cellPhone: '857-555-9012' },
  { id: 'SP004', name: 'Lisa Garcia', fatherName: 'Carlos Garcia', address: '321 Maple Dr', city: 'Miami', phone: '305-555-3456', cellPhone: '786-555-3456' },
  { id: 'SP005', name: 'David Wilson', fatherName: 'Thomas Wilson', address: '654 Elm St', city: 'Seattle', phone: '206-555-7890', cellPhone: '425-555-7890' },
];

const cities = ['New York', 'Chicago', 'Boston', 'Miami', 'Seattle', 'San Francisco', 'Los Angeles'];

const SalesPerson = () => {
  const { toast } = useToast();
  const [salesPeople, setSalesPeople] = useState(mockSalesPeople);
  const [newSalesPersonId, setNewSalesPersonId] = useState('SP006');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    id: newSalesPersonId,
    name: '',
    fatherName: '',
    address: '',
    city: '',
    phone: '',
    cellPhone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: newSalesPersonId,
      name: '',
      fatherName: '',
      address: '',
      city: '',
      phone: '',
      cellPhone: ''
    });
    setIsEditMode(false);
    setSelectedPerson(null);
  };

  const handleSave = () => {
    // Validation
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter the sales person's name.",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode && selectedPerson) {
      // Update existing sales person
      setSalesPeople(prev => 
        prev.map(person => 
          person.id === selectedPerson ? { ...formData } : person
        )
      );
      
      toast({
        title: "Updated",
        description: "Sales person information has been updated."
      });
      
      resetForm();
    } else {
      // Add new sales person
      setSalesPeople(prev => [...prev, { ...formData }]);
      
      // Generate next ID
      const nextId = `SP${String(parseInt(newSalesPersonId.replace('SP', '')) + 1).padStart(3, '0')}`;
      setNewSalesPersonId(nextId);
      
      toast({
        title: "Success",
        description: "New sales person has been added."
      });
      
      resetForm();
      setFormData(prev => ({ ...prev, id: nextId }));
    }
  };

  const handleEdit = (id: string) => {
    const personToEdit = salesPeople.find(person => person.id === id);
    if (personToEdit) {
      setFormData({ ...personToEdit });
      setIsEditMode(true);
      setSelectedPerson(id);
    }
  };

  const handleDelete = (id: string) => {
    setSalesPeople(prev => prev.filter(person => person.id !== id));
    
    toast({
      title: "Deleted",
      description: "Sales person has been removed."
    });
    
    if (selectedPerson === id) {
      resetForm();
    }
  };

  // Filter sales people based on search term
  const filteredSalesPeople = salesPeople.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer 
      title="Sales Personnel Management" 
      subtitle="Add and manage your sales team members"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {isEditMode ? "Edit Sales Person" : "Add Sales Person"}
              </CardTitle>
              <CardDescription>
                {isEditMode 
                  ? "Update the information for an existing sales person." 
                  : "Enter details to add a new sales person to your team."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Sales Person ID</Label>
                  <Input 
                    id="id" 
                    name="id" 
                    value={formData.id} 
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder="Full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input 
                    id="fatherName" 
                    name="fatherName" 
                    value={formData.fatherName} 
                    onChange={handleInputChange}
                    placeholder="Father's name"
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
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
                
                <div className="flex gap-3 pt-4">
                  <CustomButton
                    variant="outline3D"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </CustomButton>
                  
                  <CustomButton
                    onClick={handleSave}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4" />
                    {isEditMode ? "Update" : "Save"}
                  </CustomButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Sales Team</CardTitle>
              <CardDescription>
                Manage your sales personnel records
              </CardDescription>
              <SearchInput 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Search by name or ID..."
                className="mt-2"
              />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">City</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalesPeople.length > 0 ? (
                      filteredSalesPeople.map((person) => (
                        <TableRow key={person.id}>
                          <TableCell>{person.id}</TableCell>
                          <TableCell>
                            <div>
                              <div>{person.name}</div>
                              <div className="text-sm text-muted-foreground md:hidden">
                                {person.city} • {person.cellPhone || person.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{person.city}</TableCell>
                          <TableCell className="hidden md:table-cell">{person.cellPhone || person.phone}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <CustomButton
                                size="sm"
                                variant="outline3D"
                                onClick={() => handleEdit(person.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </CustomButton>
                              <CustomButton
                                size="sm"
                                variant="outline3D"
                                onClick={() => handleDelete(person.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </CustomButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No sales personnel found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default SalesPerson;
