
import React from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CashBankPayment = () => {
  return (
    <PageContainer 
      title="Cash & Bank Payment" 
      subtitle="Manage cash and bank payments"
    >
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Payments Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Cash and bank payments functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default CashBankPayment;
