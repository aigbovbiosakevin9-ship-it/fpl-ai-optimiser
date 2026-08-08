import { useAuth } from '@/context/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthScreen />;
}

export default App;
