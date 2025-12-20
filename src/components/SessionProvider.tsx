import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Profile } from '@/types/supabase';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Define routes that require authentication
  const protectedRoutes = ['/dashboard/client', '/dashboard/admin'];

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
        // If signed out, always redirect to login
        navigate('/login');
      } else if (currentSession) {
        // User is signed in
        if (currentPath === '/login' || currentPath === '/') {
          // If on login or home page, redirect to dashboard based on role
          if (userProfile?.role === 'admin') {
            navigate('/dashboard/admin');
          } else {
            navigate('/dashboard/client');
          }
        }
      } else {
        // No session and not signed in
        // If trying to access a protected route, redirect to login
        if (protectedRoutes.some(route => currentPath.startsWith(route))) {
          navigate('/login');
        }
        // If on '/' or '/login', allow it to render
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

      if (!initialSession) {
        // No initial session
        // If trying to access a protected route, redirect to login
        if (protectedRoutes.some(route => currentPath.startsWith(route))) {
          navigate('/login');
        }
        // If on '/' or '/login', allow it to render
      } else {
        // Initial session exists
        if (currentPath === '/login' || currentPath === '/') {
          // If on login or home page, redirect to dashboard based on role
          if (initialUserProfile?.role === 'admin') {
            navigate('/dashboard/admin');
          } else {
            navigate('/dashboard/client');
          }
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