import React from 'react';
import { useSession } from '@/components/SessionProvider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
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

  // Check if user is logged in and has the 'client' role
  if (!user || user.profile?.role !== 'client') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-foreground">You need to log in as a client to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-heading">Client Dashboard</h1>
        <p className="text-lg mb-4">Welcome, {user.profile?.first_name || user.email}!</p>
        <p className="mb-8">This is where clients will access their forms and information.</p>
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ClientDashboard;