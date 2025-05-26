import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ExampleTable from './generatetable/ExampleTable';
import Description from './pages/Description';
import FeedbackPage from './pages/FeedbackPage';
// import Contact from './pages/Contact';
import Build from './pages/Build';
import NotFound from './pages/NotFound';
import LandingPage from './pages/Home';
import UseCasesPage from './pages/UseCasesPage';


// Wrapper to access location in Routes
const AppContent = () => {
  const location = useLocation();

  const isNotFound = location.pathname !== '/' &&
    !['/features', '/feedback', '/examples', '/build'].includes(location.pathname);

  // Check if we're on the build route
  const isBuildRoute = location.pathname === '/build';

  return (
    <>
      {!isNotFound && <Header />}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<ExampleTable />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/examples" element={<UseCasesPage />} />
          <Route path="/build" element={<Build />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isNotFound && !isBuildRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      minWidth: '100vw',
    }}>
      <Router>
        <AppContent />
      </Router>
    </div>
  );
};

export default App;
