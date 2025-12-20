import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ClientRequestForm } from '@/components/ClientRequestForm';

const ClientDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      navigate('/login'); // Redirect to login after sign out
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Client Dashboard</h1>
        <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 text-white rounded-md mb-8">
          Sign Out
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Submit a New Request</h2>
            <ClientRequestForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;