import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

export const CollaboratorForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Collaborator added:', { name, email });
    toast({
      title: "Collaborator Added",
      description: `${name} has been added as a collaborator.`,
    });
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-border rounded-lg bg-card">
      <div>
        <label htmlFor="collaborator-name" className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
        <Input
          id="collaborator-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Collaborator's full name"
          required
        />
      </div>
      <div>
        <label htmlFor="collaborator-email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
        <Input
          id="collaborator-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Collaborator's email address"
          required
        />
      </div>
      <Button type="submit" className="w-full">Add Collaborator</Button>
    </form>
  );
};