
import React, { useState } from 'react';
import { 
  Calendar, 
  Filter, 
  FileText, 
  BarChart, 
  DollarSign, 
  CreditCard,
  ListChecks,
  Percent,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';

// Mock data for report types
const reportTypes = [
  { id: 'balance-summary', name: 'Balance Summary', icon: FileText, description: 'Summary of all account balances' },
  { id: 'account-summary', name: 'Account Summary', icon: FileText, description: 'Detailed account activity summary' },
  { id: 'transaction-summary', name: 'Transaction Summary', icon: CreditCard, description: 'Summary of all transactions' },
  { id: 'purchase-payment', name: 'Purchase Payment Summary', icon: DollarSign, description: 'Summary of all purchase payments' },
  { id: 'credit-debit', name: 'Total Credit/Debit', icon: BarChart, description: 'Overview of total credits and debits' },
  { id: 'account-list', name: 'Account List', icon: ListChecks, description: 'Complete list of all accounts' },
  { id: 'profit-loss', name: 'Profit and Loss Report', icon: Percent, description: 'Detailed profit and loss statement' },
  { id: 'cash-pay', name: 'Cash Pay Summary', icon: DollarSign, description: 'Summary of all cash payments' },
  { id: 'balance-sheet', name: 'Balance Sheet', icon: FileSpreadsheet, description: 'Complete balance sheet' },
  { id: 'sales-receipt', name: 'Sales Receipt Summary', icon: Receipt, description: 'Summary of all sales receipts' },
  { id: 'expense-income', name: 'Expense Income Report', icon: BarChart, description: 'Detailed expense and income report' }
];

// Mock data for cities and account types
const mockCities = ['All Cities', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'];
const mockTypes = ['All Types', 'Customer', 'Supplier', 'Expense', 'Income'];
const mockNames = ['All Names', 'Memorial Hospital', 'City Clinic', 'Riverside Medical', 'Lakeside Pharmacy', 'MediTech Suppliers'];

const AccountsReports = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedName, setSelectedName] = useState('All Names');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  
  const handleGenerateReport = (reportId: string) => {
    setSelectedReport(reportId);
    // In a real application, this would fetch the report data
    console.log('Generating report:', reportId);
    console.log('Filters:', { startDate, endDate, selectedType, selectedCity, selectedName });
  };
  
  return (
    <PageContainer 
      title="Accounts Reports" 
      subtitle="Generate and analyze financial reports"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Report Filters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Select date range and filters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  id="startDate"
                  type="date"
                  className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  id="endDate"
                  type="date"
                  className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">Type</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <select
                  id="type"
                  className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {mockTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <select
                  id="city"
                  className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {mockCities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <select
                  id="name"
                  className="w-full pl-10 p-2 rounded-md border border-input bg-background"
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                >
                  {mockNames.map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Report Types */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Select a report to generate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((report) => (
                <Button
                  key={report.id}
                  variant="outline"
                  className={`h-auto py-4 flex flex-col items-center justify-center text-center ${
                    selectedReport === report.id ? 'border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => handleGenerateReport(report.id)}
                >
                  <report.icon className="h-6 w-6 mb-2" />
                  <div className="font-medium">{report.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{report.description}</div>
                </Button>
              ))}
            </div>
            
            {selectedReport && (
              <div className="mt-8 p-6 border rounded-lg bg-muted/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {reportTypes.find(r => r.id === selectedReport)?.name} Preview
                  </h3>
                  
                  <div className="flex space-x-2">
                    <CustomButton variant="outline3D" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Export PDF
                    </CustomButton>
                    <CustomButton variant="outline3D" size="sm">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export Excel
                    </CustomButton>
                    <CustomButton variant="premium" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Print Report
                    </CustomButton>
                  </div>
                </div>
                
                <div className="p-8 border rounded bg-card text-center">
                  <p className="text-muted-foreground">
                    Report preview would be displayed here in a real application.
                    <br />
                    The report would include data based on the selected filters:
                    <br />
                    Date Range: {startDate} to {endDate}
                    <br />
                    Type: {selectedType} | City: {selectedCity} | Name: {selectedName}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AccountsReports;
