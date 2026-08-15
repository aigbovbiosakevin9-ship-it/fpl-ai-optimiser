import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsOfService from '@/components/TermsOfService';
import Blog from '@/components/Blog';
import { Loader2 } from 'lucide-react';

type Page = 'landing' | 'auth' | 'privacy' | 'terms' | 'blog';

function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>('landing');
  const [blogSlug, setBlogSlug] = useState<string | undefined>();

  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === 'privacy' || detail === 'terms') {
        setPage(detail);
      } else if (detail === 'blog' || detail.startsWith('blog:')) {
        setBlogSlug(detail.startsWith('blog:') ? detail.slice(5) : undefined);
        setPage('blog');
      } else if (detail === 'landing') {
        setPage('landing');
      }
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (user) return <Dashboard />;

  if (page === 'privacy') return <PrivacyPolicy onBack={() => setPage('landing')} />;
  if (page === 'terms') return <TermsOfService onBack={() => setPage('landing')} />;
  if (page === 'auth') return <AuthScreen onBack={() => setPage('landing')} />;
  if (page === 'blog') return <Blog slug={blogSlug} onBack={() => setPage('landing')} />;

  return <LandingPage onEnterApp={() => setPage('auth')} />;
}

export default App;
