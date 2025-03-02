
import React from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OtherMenu = () => {
  return (
    <PageContainer 
      title="Other Menu" 
      subtitle="Additional system functionalities"
    >
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Other Menu Options</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Other menu functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default OtherMenu;
