
import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/ui/CustomButton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const NewUser = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  
  // Permissions state
  const [salesPermission, setSalesPermission] = useState('no');
  const [purchasePermission, setPurchasePermission] = useState('no');
  const [accountsPermission, setAccountsPermission] = useState('no');
  const [itemRegistrationPermission, setItemRegistrationPermission] = useState('no');
  const [reportsPermission, setReportsPermission] = useState('no');
  const [targetPermission, setTargetPermission] = useState('no');

  const handleNewUser = () => {
    // Handle new user creation logic here
    console.log('Creating new user...');
  };

  const handleUpdateUser = () => {
    // Handle user update logic here
    console.log('Updating user...');
  };

  return (
    <PageContainer 
      title="New User" 
      subtitle="Create and manage user accounts"
      icon={<UserCircle className="h-6 w-6 text-primary" />}
    >
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Sales</Label>
              <RadioGroup value={salesPermission} onValueChange={setSalesPermission}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="sales-yes" />
                  <Label htmlFor="sales-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="sales-no" />
                  <Label htmlFor="sales-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Purchase</Label>
              <RadioGroup value={purchasePermission} onValueChange={setPurchasePermission}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="purchase-yes" />
                  <Label htmlFor="purchase-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="purchase-no" />
                  <Label htmlFor="purchase-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Accounts</Label>
              <RadioGroup value={accountsPermission} onValueChange={setAccountsPermission}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="accounts-yes" />
                  <Label htmlFor="accounts-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="accounts-no" />
                  <Label htmlFor="accounts-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Item Registration</Label>
              <RadioGroup value={itemRegistrationPermission} onValueChange={setItemRegistrationPermission}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="item-reg-yes" />
                  <Label htmlFor="item-reg-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="item-reg-no" />
                  <Label htmlFor="item-reg-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Reports</Label>
              <RadioGroup value={reportsPermission} onValueChange={setReportsPermission}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="reports-yes" />
                  <Label htmlFor="reports-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="reports-no" />
                  <Label htmlFor="reports-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Target</Label>
              <RadioGroup value={targetPermission} onValueChange={setTargetPermission}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="target-yes" />
                  <Label htmlFor="target-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="target-no" />
                  <Label htmlFor="target-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <CustomButton 
              variant="outline3D"
              onClick={handleNewUser}
            >
              New
            </CustomButton>
            <CustomButton 
              variant="outline3D"
              onClick={handleUpdateUser}
            >
              Update
            </CustomButton>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default NewUser;
