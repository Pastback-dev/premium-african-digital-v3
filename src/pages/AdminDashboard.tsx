import React from 'react';
import { useSession } from '@/components/SessionProvider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  // Check if user is logged in and has the 'admin' role
  if (!user || user.profile?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-foreground">You need to log in as an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-heading">Admin Dashboard</h1>
        <p className="text-lg mb-4">Welcome, Administrator {user.profile?.first_name || user.email}!</p>
        <p className="mb-8">This is where administrators will manage clients and data.</p>
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;