
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Calendar, 
  AlertCircle, 
  DollarSign,
  RefreshCw
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';

const Dashboard = () => {
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  // Mock data for dashboard
  const stats = [
    {
      title: "Total Sales",
      value: "$12,345",
      change: "+12%",
      changeDirection: "up",
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: "Products",
      value: "254",
      change: "+5",
      changeDirection: "up",
      icon: <Package className="h-4 w-4" />
    },
    {
      title: "Orders",
      value: "83",
      change: "+12%",
      changeDirection: "up",
      icon: <ShoppingCart className="h-4 w-4" />
    },
    {
      title: "Customers",
      value: "42",
      change: "+3",
      changeDirection: "up",
      icon: <Users className="h-4 w-4" />
    }
  ];

  const recentSales = [
    {
      id: "INV-001",
      customer: "Memorial Hospital",
      amount: "$2,345.00",
      status: "Paid",
      date: "2 hours ago"
    },
    {
      id: "INV-002",
      customer: "City Clinic",
      amount: "$1,245.00",
      status: "Pending",
      date: "5 hours ago"
    },
    {
      id: "INV-003",
      customer: "Riverside Medical Center",
      amount: "$3,450.00",
      status: "Paid",
      date: "Yesterday"
    },
    {
      id: "INV-004",
      customer: "Lakeside Pharmacy",
      amount: "$845.00",
      status: "Paid",
      date: "Yesterday"
    },
    {
      id: "INV-005",
      customer: "Central Hospital",
      amount: "$1,765.00",
      status: "Refunded",
      date: "3 days ago"
    }
  ];

  const lowStockItems = [
    {
      id: "PRD-001",
      name: "Surgical Gloves (L)",
      stock: "12 boxes",
      threshold: "20 boxes"
    },
    {
      id: "PRD-002",
      name: "Bandages (Premium)",
      stock: "5 packs",
      threshold: "15 packs"
    },
    {
      id: "PRD-003",
      name: "Disinfectant Solution",
      stock: "3 units",
      threshold: "10 units"
    }
  ];

  const expiringItems = [
    {
      id: "PRD-005",
      name: "Penicillin Injection",
      expiry: "Jan 15, 2024",
      stock: "15 units"
    },
    {
      id: "PRD-006",
      name: "Flu Vaccine",
      expiry: "Jan 30, 2024",
      stock: "25 units"
    }
  ];

  const quickActions = [
    {
      title: "New Sale",
      icon: <ShoppingCart className="h-5 w-5" />,
      path: "/sales/new"
    },
    {
      title: "Add Product",
      icon: <Package className="h-5 w-5" />,
      path: "/products/new"
    },
    {
      title: "Reports",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/reports"
    },
    {
      title: "Returns",
      icon: <RefreshCw className="h-5 w-5" />,
      path: "/returns"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-32 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">{currentDate}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 lg:mt-0">
              {quickActions.map((action, index) => (
                <CustomButton key={index} variant="outline3D" size="icon" asChild>
                  <Link to={action.path} className="flex flex-col items-center justify-center p-2 h-auto w-auto">
                    {action.icon}
                    <span className="text-xs mt-1">{action.title}</span>
                  </Link>
                </CustomButton>
              ))}
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            {stats.map((stat, index) => (
              <Card key={index} className="animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`flex items-center text-xs ${stat.changeDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.changeDirection === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />}
                    {stat.change} from last month
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Sales */}
            <Card className="lg:col-span-1 animate-on-scroll">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You have {recentSales.length} sales this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-medium">{sale.customer}</span>
                        <span className="text-sm text-muted-foreground">
                          {sale.id} · {sale.date}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          sale.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : sale.status === 'Pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {sale.status}
                        </span>
                        <span className="font-medium ml-4">{sale.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <CustomButton variant="ghost3D" className="w-full" asChild>
                  <Link to="/sales">View All Sales</Link>
                </CustomButton>
              </CardFooter>
            </Card>
            
            {/* Alerts */}
            <div className="space-y-6 lg:col-span-1">
              {/* Low Stock Items */}
              <Card className="animate-on-scroll">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium">Low Stock Alert</CardTitle>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.id}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-amber-500">{item.stock}</span>
                          <span className="text-xs text-muted-foreground">Threshold: {item.threshold}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <CustomButton variant="ghost3D" className="w-full" asChild>
                    <Link to="/inventory">Manage Inventory</Link>
                  </CustomButton>
                </CardFooter>
              </Card>
              
              {/* Expiring Items */}
              <Card className="animate-on-scroll" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium">Expiring Soon</CardTitle>
                  <Calendar className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expiringItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.id}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-red-500">{item.expiry}</span>
                          <span className="text-xs text-muted-foreground">Stock: {item.stock}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <CustomButton variant="ghost3D" className="w-full" asChild>
                    <Link to="/inventory/expiring">View All Expiring</Link>
                  </CustomButton>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <Card className="mb-8 animate-on-scroll">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Sales performance for the current month</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/70" />
                <p>Sales chart will be displayed here</p>
                <p className="text-sm">Data visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
