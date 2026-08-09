import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [showApp, setShowApp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (user) return <Dashboard />;

  if (showApp) return <AuthScreen onBack={() => setShowApp(false)} />;

  return <LandingPage onEnterApp={() => setShowApp(true)} />;
}

export default App;
