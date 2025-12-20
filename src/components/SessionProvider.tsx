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
    console.log('Fetching profile for user:', userId);
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
    console.log('Profile fetched:', data);
    return data as Profile;
  };

  useEffect(() => {
    console.log('SessionProvider useEffect triggered.');
    const handleAuthStateChange = async (event: string, currentSession: Session | null) => {
      console.log('Auth state change event:', event, 'Session:', currentSession);
      setSession(currentSession);
      setUser(currentSession?.user || null);

      let userProfile: Profile | null = null;
      if (currentSession?.user) {
        userProfile = await fetchUserProfile(currentSession.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setLoading(false); // Set loading to false after processing auth state

      const currentPath = location.pathname;
      console.log('Current path:', currentPath, 'User profile role:', userProfile?.role);

      if (event === 'SIGNED_OUT') {
        console.log('Redirecting to /login due to SIGNED_OUT event.');
        navigate('/login');
      } else if (currentSession) {
        // User is signed in
        if (currentPath === '/login' || currentPath === '/') {
          // If on login or home page, redirect to dashboard based on role
          if (userProfile?.role === 'admin') {
            console.log('Redirecting to /dashboard/admin.');
            navigate('/dashboard/admin');
          } else {
            console.log('Redirecting to /dashboard/client.');
            navigate('/dashboard/client');
          }
        }
      } else {
        // No session and not signed in
        // If trying to access a protected route, redirect to login
        if (protectedRoutes.some(route => currentPath.startsWith(route))) {
          console.log('Redirecting to /login as no session and on protected route.');
          navigate('/login');
        }
        // If on '/' or '/login', allow it to render
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      console.log('Initial session check. Session:', initialSession);
      let initialUserProfile: Profile | null = null;
      if (initialSession?.user) {
        initialUserProfile = await fetchUserProfile(initialSession.user.id);
        setProfile(initialUserProfile);
      }
      setSession(initialSession);
      setUser(initialSession?.user || null);
      setLoading(false); // Set loading to false after initial session check

      const currentPath = location.pathname;
      console.log('Initial check current path:', currentPath, 'Initial user profile role:', initialUserProfile?.role);

      if (!initialSession) {
        // No initial session
        // If trying to access a protected route, redirect to login
        if (protectedRoutes.some(route => currentPath.startsWith(route))) {
          console.log('Initial check: Redirecting to /login as no initial session and on protected route.');
          navigate('/login');
        }
        // If on '/' or '/login', allow it to render
      } else {
        // Initial session exists
        if (currentPath === '/login' || currentPath === '/') {
          // If on login or home page, redirect to dashboard based on role
          if (initialUserProfile?.role === 'admin') {
            console.log('Initial check: Redirecting to /dashboard/admin.');
            navigate('/dashboard/admin');
          } else {
            console.log('Initial check: Redirecting to /dashboard/client.');
            navigate('/dashboard/client');
          }
        }
      }
    });

    return () => {
      console.log('SessionProvider useEffect cleanup.');
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