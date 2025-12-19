import React from 'react';
import { useSession } from '@/components/SessionProvider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { user, profile, loading } = useSession(); // Get profile from session
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

  if (!user || profile?.role !== 'client') { // Check for client role
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-foreground">You need to log in as a client to view this page.</p>
      </div>
    );
  }

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : user.email;

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-heading">Client Dashboard</h1>
        <p className="text-lg mb-4">Welcome, {displayName}!</p>
        <p className="mb-8">This is where clients will access their forms and information.</p>
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ClientDashboard;