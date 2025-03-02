
import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  BarChart3, 
  DollarSign, 
  PieChart, 
  ListChecks, 
  FileSpreadsheet,
  FileBarChart,
  BookOpen,
  Receipt,
  BarChart4,
  FileDown,
  Printer
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';
import SearchInput from '@/components/ui/SearchInput';
import { useToast } from '@/components/ui/use-toast';

// Mock data for cities
const mockCities = ['New York', 'Chicago', 'Los Angeles', 'Dallas', 'Boston', 'Miami'];

// Mock data for account types
const mockTypes = ['Customer', 'Supplier', 'Employee', 'Expense', 'Income'];

// Mock data for account names
const mockNames = [
  { id: 1, name: 'Memorial Hospital', type: 'Customer', city: 'New York', balance: 5000.00 },
  { id: 2, name: 'City Clinic', type: 'Customer', city: 'Chicago', balance: 3500.00 },
  { id: 3, name: 'Riverside Medical Center', type: 'Customer', city: 'Los Angeles', balance: 12000.00 },
  { id: 4, name: 'MediSuppliers', type: 'Supplier', city: 'Dallas', balance: -2500.00 },
  { id: 5, name: 'Lab Equipment Co.', type: 'Supplier', city: 'Boston', balance: -4300.00 },
  { id: 6, name: 'Office Rent', type: 'Expense', city: 'New York', balance: -1200.00 },
  { id: 7, name: 'Utility Bills', type: 'Expense', city: 'New York', balance: -550.00 },
  { id: 8, name: 'Medication Sales', type: 'Income', city: 'Miami', balance: 15600.00 },
  { id: 9, name: 'Consulting Services', type: 'Income', city: 'Chicago', balance: 7850.00 },
];

// Report types
const reportTypes = [
  { id: 'balance-summary', name: 'Balance Summary', icon: BarChart3 },
  { id: 'balance', name: 'Balance', icon: DollarSign },
  { id: 'account-summary', name: 'Account Summary', icon: FileText },
  { id: 'transaction-summary', name: 'Transaction Summary', icon: ListChecks },
  { id: 'purchase-payment-summary', name: 'Purchase Payment Summary', icon: FileSpreadsheet },
  { id: 'total-credit-debit', name: 'Total Credit/Debit', icon: BarChart4 },
  { id: 'account-list', name: 'Account List', icon: BookOpen },
  { id: 'profit-loss', name: 'Profit and Loss Report', icon: PieChart },
  { id: 'cash-pay-summary', name: 'Cash Pay Summary', icon: DollarSign },
  { id: 'balance-sheet', name: 'Balance Sheet', icon: FileBarChart },
  { id: 'sales-receipt-summary', name: 'Sales Receipt Summary', icon: Receipt },
  { id: 'expense-income', name: 'Expense Income Report', icon: BarChart4 },
];

const AccountsReports = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeReport, setActiveReport] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Filter accounts based on filters
  const filteredAccounts = mockNames.filter(account => {
    return (
      (selectedType === '' || account.type === selectedType) &&
      (selectedCity === '' || account.city === selectedCity) &&
      (searchTerm === '' || account.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleGenerateReport = (reportId: string) => {
    setActiveReport(reportId);
    toast({
      title: "Report Generated",
      description: `${reportTypes.find(r => r.id === reportId)?.name} has been generated.`,
    });
  };

  const handleExportReport = () => {
    if (!activeReport) {
      toast({
        title: "No Report Selected",
        description: "Please generate a report first.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Report Exported",
      description: "Report has been exported to Excel format.",
    });
  };

  const handlePrintReport = () => {
    if (!activeReport) {
      toast({
        title: "No Report Selected",
        description: "Please generate a report first.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Printing Report",
      description: "Report has been sent to printer.",
    });
  };

  return (
    <PageContainer 
      title="Accounts Reports" 
      subtitle="Generate and analyze financial reports"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Report Filters */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <CardTitle>Report Filters</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExportReport}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" onClick={handlePrintReport}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">Type</label>
                <select
                  id="type"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {mockTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                <select
                  id="city"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  {mockCities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="accountSearch" className="block text-sm font-medium mb-1">Search Account</label>
                <SearchInput 
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search accounts..."
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Available Reports */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {reportTypes.map(report => (
                <Button
                  key={report.id}
                  variant={activeReport === report.id ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleGenerateReport(report.id)}
                >
                  <report.icon className="mr-2 h-4 w-4" />
                  {report.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Report Display */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {activeReport 
                ? reportTypes.find(r => r.id === activeReport)?.name 
                : "Report Preview"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeReport ? (
              <div>
                <div className="mb-4 p-2 bg-muted rounded-md">
                  <p className="text-sm font-medium">Date Range: {startDate} to {endDate}</p>
                  <p className="text-sm">
                    Filters: 
                    {selectedType ? ` Type: ${selectedType}` : ' All Types'}
                    {selectedCity ? `, City: ${selectedCity}` : ', All Cities'}
                    {searchTerm ? `, Search: "${searchTerm}"` : ''}
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">City</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAccounts.length > 0 ? (
                        filteredAccounts.map((account, index) => (
                          <tr 
                            key={account.id} 
                            className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                              index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                            }`}
                          >
                            <td className="px-4 py-3 text-sm">{account.name}</td>
                            <td className="px-4 py-3 text-sm">{account.type}</td>
                            <td className="px-4 py-3 text-sm">{account.city}</td>
                            <td className={`px-4 py-3 text-sm text-right ${
                              account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ${Math.abs(account.balance).toFixed(2)}
                              {account.balance < 0 ? ' (Payable)' : ' (Receivable)'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                            <Filter className="h-8 w-8 mx-auto mb-2" />
                            No accounts match the selected filters
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-border">
                        <td colSpan={3} className="px-4 py-3 text-right font-medium">Total:</td>
                        <td className="px-4 py-3 text-right font-bold">
                          ${filteredAccounts.reduce((sum, account) => sum + account.balance, 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Report Selected</h3>
                <p className="text-muted-foreground">
                  Select a report from the list on the left to generate and preview it here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AccountsReports;
