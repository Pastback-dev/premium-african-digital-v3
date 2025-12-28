import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ResponsableDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Responsable Dashboard</h1>
          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-4">Team Performance</h2>
            <p className="text-muted-foreground mb-4">Monitor and evaluate team member performance.</p>
            <Button variant="outline">View Team</Button>
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
            <p className="text-muted-foreground mb-4">Track progress and manage ongoing projects.</p>
            <Button variant="outline">View Projects</Button>
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>
            <p className="text-muted-foreground mb-4">Access detailed reports and performance analytics.</p>
            <Button variant="outline">Generate Reports</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsableDashboard;