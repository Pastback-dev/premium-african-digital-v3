import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Profile } from '@/types/supabase'; // Import the new Profile type

interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null; // Add profile to the context
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // State for profile
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      return null;
    }
    return data as Profile;
  };

  useEffect(() => {
    const handleAuthStateChange = async (event: string, currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);

      let userProfile: Profile | null = null;
      if (currentSession?.user) {
        userProfile = await fetchUserProfile(currentSession.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);

      const currentPath = location.pathname;

      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (currentSession) {
        // User is signed in
        if (currentPath === '/login' || currentPath === '/') {
          // If on login or home page, redirect based on role
          if (userProfile?.role === 'admin') {
            navigate('/dashboard/admin');
          } else {
            navigate('/dashboard/client');
          }
        }
      } else {
        // No session and not on login page, redirect to login
        if (currentPath !== '/login') {
          navigate('/login');
        }
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      let initialUserProfile: Profile | null = null;
      if (initialSession?.user) {
        initialUserProfile = await fetchUserProfile(initialSession.user.id);
        setProfile(initialUserProfile);
      }
      setSession(initialSession);
      setUser(initialSession?.user || null);
      setLoading(false);

      const currentPath = location.pathname;

      if (!initialSession && currentPath !== '/login') {
        navigate('/login');
      } else if (initialSession && (currentPath === '/login' || currentPath === '/')) {
        if (initialUserProfile?.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/client');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return (
    <SessionContext.Provider value={{ session, user, profile, loading }}>
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