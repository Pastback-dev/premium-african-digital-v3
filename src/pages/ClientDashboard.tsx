import React from 'react';
import { useSession } from '@/components/SessionProvider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ClientRequestForm } from '@/components/ClientRequestForm';
import { CollaboratorForm } from '@/components/CollaboratorForm'; // Import the new CollaboratorForm

const ClientDashboard = () => {
  const { user, profile, loading } = useSession();
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

  if (!user || profile?.role !== 'client') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-foreground">You need to log in as a client to view this page.</p>
        <Button onClick={() => navigate('/login')} className="mt-4">Go to Login</Button>
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
        <p className="text-lg mb-8">Welcome, {displayName}! Here you can submit your requests and manage collaborators.</p>
        
        <ClientRequestForm /> {/* Existing client request form */}
        
        <CollaboratorForm /> {/* New collaborator form */}

        <div className="mt-12 text-center">
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;