import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { useSession } from '@/components/SessionProvider';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  details: z.string().min(20, { message: 'Details must be at least 20 characters.' }),
});

export const ClientRequestForm = () => {
  const { user } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      details: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error('You must be logged in to submit a request.');
      return;
    }

    // In a real application, you would insert this into a 'client_requests' table
    // For now, we'll just simulate a successful submission.
    console.log('Client Request Submitted:', { ...values, userId: user.id });
    toast.success('Your request has been submitted successfully!');
    form.reset();
  }

  return (
    <div className="max-w-3xl mx-auto p-8 rounded-lg border border-border bg-card shadow-lg">
      <h2 className="text-3xl font-bold text-foreground mb-6 text-center font-heading">
        Submit a New Request
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        Tell us about your needs, and our team will get back to you shortly.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground font-heading uppercase tracking-wider">Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Request for new equipment catalog" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground font-heading uppercase tracking-wider">Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="I am looking for heavy machinery for a new construction project..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="premium" size="lg" className="w-full group">
            Submit Request
            <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>
      </Form>
    </div>
  );
};