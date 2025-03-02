
import React from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CashBook = () => {
  return (
    <PageContainer 
      title="Cash Book" 
      subtitle="Manage cash transactions and balances"
    >
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Cash Book Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Cash Book functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CashBook;
