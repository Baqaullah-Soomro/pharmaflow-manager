
import React, { useState } from 'react';
import { FileText, Calendar, BarChart4, Filter, Printer, Download, Eye } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Mock report options
const reportOptions = [
  { value: 'account-summary', label: 'Account Summary' },
  { value: 'all-company-sales', label: 'All Company Sales Report' },
  { value: 'balance-sheet', label: 'Balance Sheet' },
  { value: 'company-purchase', label: 'Company Purchase Report' },
  { value: 'company-sales', label: 'Company Sales Report' },
  { value: 'employees-list', label: 'Employees List' },
  { value: 'item-purchase', label: 'Item Purchase' },
  { value: 'ledger-account', label: 'Ledger Account' },
  { value: 'monthly-sales', label: 'Monthly Sales Report' },
  { value: 'parties-sales', label: 'Parties Sales Report' },
  { value: 'profit-loss', label: 'Profit and Loss Report' },
  { value: 'purchase-report', label: 'Purchase Report' },
  { value: 'sales-bill-details', label: 'Sales Bill Details' },
  { value: 'sales-profit', label: 'Sales Profit Report' },
  { value: 'sales-report', label: 'Sales Report' },
];

// Mock report data for preview
const mockReportData = {
  title: 'Monthly Sales Report',
  periodLabel: 'Period: January 2023 - March 2023',
  headers: ['Date', 'Invoice', 'Customer', 'Items', 'Amount', 'Status'],
  rows: [
    { date: '01/03/2023', invoice: 'INV-001', customer: 'ABC Hospital', items: 5, amount: '$1,450.00', status: 'Paid' },
    { date: '05/03/2023', invoice: 'INV-002', customer: 'City Clinic', items: 12, amount: '$3,275.50', status: 'Paid' },
    { date: '12/03/2023', invoice: 'INV-003', customer: 'Health Plus', items: 3, amount: '$675.25', status: 'Pending' },
    { date: '18/03/2023', invoice: 'INV-004', customer: 'Medicare Center', items: 8, amount: '$2,120.00', status: 'Paid' },
    { date: '25/03/2023', invoice: 'INV-005', customer: 'Wellness Pharmacy', items: 15, amount: '$4,350.75', status: 'Pending' },
  ],
  summary: {
    totalInvoices: 5,
    totalAmount: '$11,871.50',
    paidAmount: '$6,845.50',
    pendingAmount: '$5,026.00',
  }
};

const NewReport = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReport, setShowReport] = useState(false);
  const { toast } = useToast();

  const handleReportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReport(e.target.value);
    setShowReport(false); // Hide report when selection changes
  };

  const handleGenerateReport = () => {
    if (!selectedReport) {
      toast({
        title: "Selection Required",
        description: "Please select a report type.",
        variant: "destructive",
      });
      return;
    }

    if (!startDate || !endDate) {
      toast({
        title: "Date Range Required",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    setShowReport(true);
    toast({
      title: "Report Generated",
      description: `Your ${reportOptions.find(option => option.value === selectedReport)?.label} has been generated successfully.`,
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Initiated",
      description: "Sending report to printer...",
    });
    // In a real application, you would handle printing here
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your report is being downloaded as PDF.",
    });
    // In a real application, you would handle download here
  };

  return (
    <PageContainer
      title="New Report"
      subtitle="Generate and view detailed business reports"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Selection
            </CardTitle>
            <CardDescription>
              Choose a report type and date range
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <select
                id="report-type"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={selectedReport}
                onChange={handleReportChange}
              >
                <option value="">Select a report</option>
                {reportOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <input
                id="start-date"
                type="date"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <input
                id="end-date"
                type="date"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerateReport} 
              className="w-full"
            >
              <Eye className="mr-2 h-4 w-4" />
              Show Report
            </Button>
          </CardFooter>
        </Card>

        {/* Report Display Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5" />
                  Report Preview
                </CardTitle>
                <CardDescription>
                  View and print your generated report
                </CardDescription>
              </div>
              {showReport && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {showReport ? (
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-4">
                  <h3 className="text-lg font-bold text-center">{mockReportData.title}</h3>
                  <p className="text-sm text-center text-muted-foreground mt-1">{mockReportData.periodLabel}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        {mockReportData.headers.map((header, index) => (
                          <th key={index} className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockReportData.rows.map((row, rowIndex) => (
                        <tr 
                          key={rowIndex} 
                          className={`border-t border-border ${rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                        >
                          <td className="px-4 py-3 text-sm">{row.date}</td>
                          <td className="px-4 py-3 text-sm">{row.invoice}</td>
                          <td className="px-4 py-3 text-sm">{row.customer}</td>
                          <td className="px-4 py-3 text-sm">{row.items}</td>
                          <td className="px-4 py-3 text-sm">{row.amount}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              row.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-muted/30 p-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Invoices</p>
                      <p className="text-lg font-semibold">{mockReportData.summary.totalInvoices}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-semibold">{mockReportData.summary.totalAmount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Paid Amount</p>
                      <p className="text-lg font-semibold text-green-600">{mockReportData.summary.paidAmount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Pending Amount</p>
                      <p className="text-lg font-semibold text-yellow-600">{mockReportData.summary.pendingAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <BarChart4 className="h-16 w-16 mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No Report Generated</h3>
                <p className="max-w-md mt-2">
                  Select a report type and date range, then click "Show Report" to generate and view your report here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default NewReport;
