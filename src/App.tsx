import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { TodoList } from './components/TodoList';
import { SetupRequired } from './components/SetupRequired';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {!session ? <Auth /> : <TodoList />}
    </div>
  );
}

export default App;
