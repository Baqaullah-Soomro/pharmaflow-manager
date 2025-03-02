
import React from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AccountsReports = () => {
  return (
    <PageContainer 
      title="Accounts Reports" 
      subtitle="View and generate financial reports"
    >
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Accounts Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Accounts reports functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AccountsReports;
