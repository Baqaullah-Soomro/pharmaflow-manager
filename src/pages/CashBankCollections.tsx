
import React from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CashBankCollections = () => {
  return (
    <PageContainer 
      title="Cash & Bank Collections" 
      subtitle="Manage cash and bank collections"
    >
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Collections Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Cash and bank collections functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CashBankCollections;
