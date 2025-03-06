
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/ui/CustomButton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NewCustomer = () => {
  const [name, setName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [address, setAddress] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [type, setType] = useState('');
  const [head, setHead] = useState('');
  const [salesman, setSalesman] = useState('');

  // Mock data for types and salesmen
  const types = ['Regular', 'VIP', 'Wholesale', 'Retail'];
  const salesmen = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'];
  const heads = ['North Region', 'South Region', 'East Region', 'West Region'];

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Submitting customer data...');
  };

  return (
    <PageContainer 
      title="New Customer" 
      subtitle="Add and manage customer information"
      icon={<Users className="h-6 w-6 text-primary" />}
    >
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNo">Account No</Label>
              <Input 
                id="accountNo"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Enter account number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cityArea">City/Area</Label>
              <Input 
                id="cityArea"
                value={cityArea}
                onChange={(e) => setCityArea(e.target.value)}
                placeholder="Enter city or area"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input 
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="head">Head</Label>
              <Select value={head} onValueChange={setHead}>
                <SelectTrigger>
                  <SelectValue placeholder="Select head" />
                </SelectTrigger>
                <SelectContent>
                  {heads.map((h) => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salesman">Salesman</Label>
            <Select value={salesman} onValueChange={setSalesman}>
              <SelectTrigger>
                <SelectValue placeholder="Select salesman" />
              </SelectTrigger>
              <SelectContent>
                {salesmen.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-4">
            <CustomButton 
              variant="outline3D"
              onClick={handleSubmit}
            >
              Save
            </CustomButton>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default NewCustomer;
