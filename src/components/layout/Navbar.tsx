import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [otherMenuOpen, setOtherMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Items', path: '/item-registration' },
    { name: 'Sales', path: '/sales' },
    { name: 'Purchase', path: '/purchase' },
    { name: 'Sales Return', path: '/sales-return' },
    { name: 'Cash Book', path: '/cash-book' },
    { name: 'Reports', path: '/accounts-reports' },
    { name: 'Cash Collections', path: '/cash-bank-collections' },
    { name: 'Cash Payment', path: '/cash-bank-payment' },
  ];

  const otherMenuLinks = [
    { name: 'Other Menu', path: '/other-menu' },
    { name: 'New Report', path: '/other-menu/new-report' },
    { name: 'New Account', path: '/other-menu/new-account' },
    { name: 'Sales Person', path: '/other-menu/sales-person' },
    { name: 'Inventory', path: '/other-menu/inventory' },
    { name: 'Voucher', path: '/other-menu/voucher' },
    { name: 'Purchase Return', path: '/other-menu/purchase-return' },
    { name: 'Sales Target', path: '/other-menu/sales-target' },
    { name: 'New User', path: '/other-menu/new-user' },
    { name: 'New Customer', path: '/other-menu/new-customer' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <NavLink 
              to="/" 
              className="flex items-center space-x-2 text-xl font-semibold text-primary"
            >
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
              <span>MedFlow</span>
            </NavLink>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Other Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOtherMenuOpen(!otherMenuOpen)}
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Other Menu
                <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", otherMenuOpen && "rotate-180")} />
              </button>
              
              {otherMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50">
                  <div className="py-1">
                    {otherMenuLinks.slice(1).map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                          cn(
                            'block px-4 py-2 text-sm hover:bg-gray-100',
                            isActive ? 'text-primary font-medium' : 'text-gray-700'
                          )
                        }
                        onClick={() => setOtherMenuOpen(false)}
                      >
                        {link.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/auth"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Sign In
            </NavLink>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={cn(
          'md:hidden transition-all duration-300 ease-in-out overflow-hidden',
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="space-y-1 px-4 pb-4 pt-2 bg-white/90 backdrop-blur-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  isActive
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          
          {/* Mobile Other Menu Accordion */}
          <div className="border-t border-gray-200 mt-2 pt-2">
            <button
              onClick={() => setOtherMenuOpen(!otherMenuOpen)}
              className="flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Other Menu
              <ChevronDown className={cn("h-4 w-4 transition-transform", otherMenuOpen && "rotate-180")} />
            </button>
            
            <div className={cn("pl-4 space-y-1 overflow-hidden transition-all", 
              otherMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
              {otherMenuLinks.slice(1).map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-muted text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          <NavLink
            to="/auth"
            className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
