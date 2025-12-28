import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  userRole: string | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role || null;
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session) {
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else if (role === 'client') {
          navigate('/dashboard/client');
        } else if (role === 'responsable') { // New role redirection
          navigate('/dashboard/responsable');
        }
      }
      
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setLoading(false);

      if (_event === 'SIGNED_OUT') {
        setUserRole(null);
        navigate('/login');
      } else if (_event === 'SIGNED_IN' && session) {
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else if (role === 'client') {
          navigate('/dashboard/client');
        } else if (role === 'responsable') { // New role redirection
          navigate('/dashboard/responsable');
        } else {
          // Default redirect if role not found
          navigate('/dashboard/client');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <SessionContext.Provider value={{ session, loading, userRole }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};