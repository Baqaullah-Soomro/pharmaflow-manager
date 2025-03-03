
import React, { useState } from 'react';
import PageContainer from '@/components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomButton } from '@/components/ui/CustomButton';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reportOptions = [
  "Account Summary",
  "All Company Sales Report",
  "Balance Sheet",
  "Company Purchase Report",
  "Company Sales Report",
  "Employees List",
  "Item Purchase",
  "Ledger Account",
  "Monthly Sales Report",
  "Parties Sales Report",
  "Profit and Loss Report",
  "Purchase Report",
  "Sales Bill Details",
  "Sales Profit Report",
  "Sales Report"
];

const formSchema = z.object({
  reportType: z.string({
    required_error: "Please select a report type.",
  })
});

type FormValues = z.infer<typeof formSchema>;

const NewReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportType: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Report Generated",
        description: `Successfully generated ${data.reportType} report.`,
      });
    }, 1500);
  };

  return (
    <PageContainer 
      title="New Report" 
      subtitle="Generate various reports for your business"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="reportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Report</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <CustomButton 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? "Generating..." : "Show Report"}
                  </CustomButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default NewReport;
