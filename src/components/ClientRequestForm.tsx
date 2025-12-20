import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

export const ClientRequestForm = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Request submitted:', { subject, description });
    toast({
      title: "Request Submitted",
      description: "Your request has been sent successfully.",
    });
    setSubject('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-border rounded-lg bg-card">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
        <Input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Request subject"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description of your request"
          rows={5}
          required
        />
      </div>
      <Button type="submit" className="w-full">Submit Request</Button>
    </form>
  );
};