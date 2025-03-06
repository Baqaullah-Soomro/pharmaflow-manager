import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ArrowDownLeft, 
  BookOpen, 
  BarChart, 
  MoreHorizontal, 
  Wallet, 
  CreditCard,
  FileText,
  Users,
  User,
  Boxes,
  FileSpreadsheet,
  ArrowLeftRight,
  Target,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Items', path: '/item-registration', icon: <Package size={20} /> },
    { name: 'Sales', path: '/sales', icon: <ShoppingCart size={20} /> },
    { name: 'Purchase', path: '/purchase', icon: <ShoppingCart size={20} /> },
    { name: 'Sales Return', path: '/sales-return', icon: <ArrowDownLeft size={20} /> },
    { name: 'Cash Book', path: '/cash-book', icon: <BookOpen size={20} /> },
    { name: 'Reports', path: '/accounts-reports', icon: <BarChart size={20} /> },
    { name: 'Cash Collections', path: '/cash-bank-collections', icon: <Wallet size={20} /> },
    { name: 'Cash Payment', path: '/cash-bank-payment', icon: <CreditCard size={20} /> },
  ];

  const otherMenuLinks = [
    { name: 'Other Menu', path: '/other-menu', icon: <MoreHorizontal size={20} /> },
    { name: 'New Report', path: '/other-menu/new-report', icon: <FileText size={20} /> },
    { name: 'New Account', path: '/other-menu/new-account', icon: <FileText size={20} /> },
    { name: 'Sales Person', path: '/other-menu/sales-person', icon: <User size={20} /> },
    { name: 'Inventory', path: '/other-menu/inventory', icon: <Boxes size={20} /> },
    { name: 'Voucher', path: '/other-menu/voucher', icon: <FileSpreadsheet size={20} /> },
    { name: 'Purchase Return', path: '/other-menu/purchase-return', icon: <ArrowLeftRight size={20} /> },
    { name: 'Sales Target', path: '/other-menu/sales-target', icon: <Target size={20} /> },
    { name: 'New User', path: '/other-menu/new-user', icon: <UserPlus size={20} /> },
    { name: 'New Customer', path: '/other-menu/new-customer', icon: <Users size={20} /> },
  ];

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <NavLink to="/" className="flex items-center">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path
                  d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22V12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 7L12 12L4 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 17L12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 17L12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xl font-semibold text-primary">MedFlow</span>
            </div>
          )}
          {collapsed && (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary mx-auto"
            >
              <path
                d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 7L12 12L4 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 17L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 17L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </NavLink>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-muted text-muted-foreground"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="py-4 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  collapsed ? "justify-center" : "justify-start",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
              title={collapsed ? link.name : undefined}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {!collapsed && <span className="ml-3 text-sm font-medium">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Other Menu Section */}
        <div className="mt-6">
          <div className={cn(
            "px-3 py-2 text-xs font-semibold text-muted-foreground",
            collapsed && "text-center"
          )}>
            {!collapsed && "OTHER MENU"}
            {collapsed && "•••"}
          </div>
          <nav className="mt-2 space-y-1 px-2">
            {otherMenuLinks.slice(1).map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    collapsed ? "justify-center" : "justify-start",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
                title={collapsed ? link.name : undefined}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {!collapsed && <span className="ml-3 text-sm font-medium">{link.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <NavLink
            to="/auth"
            className={cn(
              "flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md shadow transition-colors hover:bg-primary/90",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <User size={18} />
            {!collapsed && <span className="ml-2 text-sm font-medium">Sign In</span>}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
