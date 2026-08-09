import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Mission from '@/pages/Mission';
import Eglises from '@/pages/Eglises';
import Education from '@/pages/Education';
import CentreFormation from '@/pages/CentreFormation';
import Medical from '@/pages/Medical';
import Actualites from '@/pages/Actualites';
import Contact from '@/pages/Contact';
import Soutenir from '@/pages/Soutenir';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import OAuthConsent from '@/pages/OAuthConsent';

// Lazy load de la page Formation : elle embarque Swiper.js (carrousel 3D),
// une librairie tierce lourde utilisée uniquement sur cette page.
// Ça évite que son poids pèse sur les autres routes et isole son
// chargement au moment réel où l'utilisateur visite /formation.
const Formation = lazy(() => import('@/pages/Formation'));

// Fallback léger affiché pendant le téléchargement du chunk Formation
const FormationFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/eglises" element={<Eglises />} />
        <Route
          path="/formation"
          element={
            <Suspense fallback={<FormationFallback />}>
              <Formation />
            </Suspense>
          }
        />
        <Route path="/education" element={<Education />} />
        <Route path="/centre-de-formation" element={<CentreFormation />} />
        <Route path="/medical" element={<Medical />} />
        <Route path="/actualites" element={<Actualites />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/soutenir" element={<Soutenir />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth/consent" element={<OAuthConsent />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollProgressBar />
        <ScrollToTop />
        <AuthenticatedApp />
      </Router>
    </AuthProvider>
  );
}

export default App;