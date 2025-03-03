
import React, { useState } from 'react';
import { Calendar, FileText, Filter } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import { Select } from '@/components/ui/select';

// Mock data for report types
const reportTypes = [
  { id: 'account-summary', name: 'Account Summary' },
  { id: 'all-company-sales', name: 'All Company Sales Report' },
  { id: 'balance-sheet', name: 'Balance Sheet' },
  { id: 'company-purchase', name: 'Company Purchase Report' },
  { id: 'company-sales', name: 'Company Sales Report' },
  { id: 'employees-list', name: 'Employees List' },
  { id: 'item-purchase', name: 'Item Purchase' },
  { id: 'ledger-account', name: 'Ledger Account' },
  { id: 'monthly-sales', name: 'Monthly Sales Report' },
  { id: 'parties-sales', name: 'Parties Sales Report' },
  { id: 'profit-loss', name: 'Profit and Loss Report' },
  { id: 'purchase-report', name: 'Purchase Report' },
  { id: 'sales-bill-details', name: 'Sales Bill Details' },
  { id: 'sales-profit', name: 'Sales Profit Report' },
  { id: 'sales-report', name: 'Sales Report' }
];

const NewReport = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedReport, setSelectedReport] = useState('');
  const [showReport, setShowReport] = useState(false);
  
  const handleGenerateReport = () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }
    setShowReport(true);
    console.log('Generating report:', selectedReport);
    console.log('Date range:', startDate, 'to', endDate);
  };
  
  return (
    <PageContainer 
      title="New Report" 
      subtitle="Generate customized reports for your business"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Report Options */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Report Options</CardTitle>
            <CardDescription>Select report type and date range</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium mb-1">Select Report</label>
              <select
                id="reportType"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <option value="">-- Select Report Type --</option>
                {reportTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
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
            
            <CustomButton 
              onClick={handleGenerateReport} 
              className="w-full"
              variant="premium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Show Report
            </CustomButton>
          </CardContent>
        </Card>
        
        {/* Report Preview */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>
              {selectedReport ? 
                reportTypes.find(r => r.id === selectedReport)?.name + ' Preview' : 
                'Select a report type to preview'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showReport ? (
              <div className="space-y-4">
                <div className="p-4 border rounded">
                  <h3 className="text-lg font-semibold mb-2">
                    {reportTypes.find(r => r.id === selectedReport)?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Date Range: {startDate} to {endDate}
                  </p>
                  
                  <div className="p-6 bg-muted/20 rounded-lg">
                    <p className="text-center text-muted-foreground">
                      This is a preview of the {reportTypes.find(r => r.id === selectedReport)?.name}.
                      <br />
                      In a production environment, this would display the actual report data.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <CustomButton variant="outline3D" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF
                  </CustomButton>
                  <CustomButton variant="outline3D" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Print Report
                  </CustomButton>
                </div>
              </div>
            ) : (
              <div className="p-8 border rounded bg-card text-center">
                <p className="text-muted-foreground">
                  Please select a report type and click "Show Report" to generate a preview.
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
