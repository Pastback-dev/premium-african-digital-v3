import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
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
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <p className="text-muted-foreground mb-4">Manage users, roles, and permissions</p>
            <Button variant="outline">View Users</Button>
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-4">Requests</h2>
            <p className="text-muted-foreground mb-4">View and manage client requests</p>
            <Button variant="outline">View Requests</Button>
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-card">
            <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
            <p className="text-muted-foreground mb-4">View platform usage and metrics</p>
            <Button variant="outline">View Analytics</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;