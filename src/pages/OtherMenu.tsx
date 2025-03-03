
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  UserPlus, 
  Package, 
  FileSpreadsheet, 
  RefreshCw, 
  BarChart4,
  UserCircle,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';

// Define the menu items
const menuItems = [
  {
    id: 'new-report',
    title: 'New Report',
    description: 'Create and generate new reports',
    icon: FileText,
    color: 'bg-blue-100 text-blue-600',
    path: '/other-menu/new-report'
  },
  {
    id: 'new-account',
    title: 'New Account',
    description: 'Add and manage customer or supplier accounts',
    icon: Users,
    color: 'bg-purple-100 text-purple-600',
    path: '/other-menu/new-account'
  },
  {
    id: 'sales-person',
    title: 'Sales Person',
    description: 'Manage your sales team personnel',
    icon: UserPlus,
    color: 'bg-green-100 text-green-600',
    path: '/other-menu/sales-person'
  },
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Check and manage your inventory levels',
    icon: Package,
    color: 'bg-amber-100 text-amber-600',
    path: '/other-menu/inventory'
  },
  {
    id: 'voucher',
    title: 'Voucher',
    description: 'Create payment and receipt vouchers',
    icon: FileSpreadsheet,
    color: 'bg-rose-100 text-rose-600',
    path: '/other-menu/voucher'
  },
  {
    id: 'purchase-return',
    title: 'Purchase Return',
    description: 'Process returns to suppliers',
    icon: RefreshCw,
    color: 'bg-red-100 text-red-600',
    path: '/other-menu/purchase-return'
  },
  {
    id: 'sales-target',
    title: 'Sales Target',
    description: 'Set and monitor sales targets',
    icon: BarChart4,
    color: 'bg-cyan-100 text-cyan-600',
    path: '/other-menu/sales-target'
  },
  {
    id: 'new-user',
    title: 'New User',
    description: 'Add new system users with permissions',
    icon: UserCircle,
    color: 'bg-indigo-100 text-indigo-600',
    path: '/other-menu/new-user'
  },
  {
    id: 'new-customer',
    title: 'New Customer',
    description: 'Add and manage customer information',
    icon: FileCheck,
    color: 'bg-emerald-100 text-emerald-600',
    path: '/other-menu/new-customer'
  }
];

const OtherMenu = () => {
  return (
    <PageContainer 
      title="Other Menu" 
      subtitle="Additional tools and functions for your medical inventory management"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.id}
            className="block"
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4">{item.description}</CardDescription>
                <CustomButton
                  variant="outline3D"
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Open
                </CustomButton>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};

export default OtherMenu;
