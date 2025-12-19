import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'client'; // Add role to profile type
}

interface SessionContextType {
  session: Session | null;
  user: (User & { profile?: Profile }) | null; // Extend User type with profile
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<(User & { profile?: Profile }) | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      return data as Profile;
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        if (currentSession) {
          const profile = await fetchUserProfile(currentSession.user.id);
          setUser({ ...currentSession.user, profile });
        } else {
          setUser(null);
        }
        setLoading(false);

        if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (currentSession && (location.pathname === '/login' || location.pathname === '/')) {
          const profile = await fetchUserProfile(currentSession.user.id);
          if (profile?.role === 'admin') {
            navigate('/dashboard/admin');
          } else {
            navigate('/dashboard/client');
          }
        } else if (!currentSession && location.pathname !== '/login') {
          navigate('/login');
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      if (initialSession) {
        const profile = await fetchUserProfile(initialSession.user.id);
        setUser({ ...initialSession.user, profile });
        if (!initialSession && location.pathname !== '/login') {
          navigate('/login');
        } else if (initialSession && (location.pathname === '/login' || location.pathname === '/')) {
          if (profile?.role === 'admin') {
            navigate('/dashboard/admin');
          } else {
            navigate('/dashboard/client');
          }
        }
      } else {
        setUser(null);
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return (
    <SessionContext.Provider value={{ session, user, loading }}>
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