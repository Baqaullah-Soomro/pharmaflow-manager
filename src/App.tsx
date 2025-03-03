import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ItemRegistration from "./pages/ItemRegistration";
import Sales from "./pages/Sales";
import Purchase from "./pages/Purchase";
import SalesReturn from "./pages/SalesReturn";
import CashBook from "./pages/CashBook";
import AccountsReports from "./pages/AccountsReports";
import OtherMenu from "./pages/OtherMenu";
import CashBankCollections from "./pages/CashBankCollections";
import CashBankPayment from "./pages/CashBankPayment";

// Other Menu Pages
import NewReport from "./pages/otherMenu/NewReport";
import NewAccount from "./pages/otherMenu/NewAccount";
import SalesPerson from "./pages/otherMenu/SalesPerson";
import Inventory from "./pages/otherMenu/Inventory";
import Voucher from "./pages/otherMenu/Voucher";
import PurchaseReturn from "./pages/otherMenu/PurchaseReturn";
import SalesTarget from "./pages/otherMenu/SalesTarget";
import NewUser from "./pages/otherMenu/NewUser";
import NewCustomer from "./pages/otherMenu/NewCustomer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/item-registration" element={<ItemRegistration />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/sales-return" element={<SalesReturn />} />
          <Route path="/cash-book" element={<CashBook />} />
          <Route path="/accounts-reports" element={<AccountsReports />} />
          <Route path="/other-menu" element={<OtherMenu />} />
          <Route path="/cash-bank-collections" element={<CashBankCollections />} />
          <Route path="/cash-bank-payment" element={<CashBankPayment />} />
          
          {/* Other Menu Routes */}
          <Route path="/other-menu/new-report" element={<NewReport />} />
          <Route path="/other-menu/new-account" element={<NewAccount />} />
          <Route path="/other-menu/sales-person" element={<SalesPerson />} />
          <Route path="/other-menu/inventory" element={<Inventory />} />
          <Route path="/other-menu/voucher" element={<Voucher />} />
          <Route path="/other-menu/purchase-return" element={<PurchaseReturn />} />
          <Route path="/other-menu/sales-target" element={<SalesTarget />} />
          <Route path="/other-menu/new-user" element={<NewUser />} />
          <Route path="/other-menu/new-customer" element={<NewCustomer />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
