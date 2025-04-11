// App.tsx
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { isSessionValid } from './session'; // adjust path if needed
import paths from './routes/paths'; // adjust if needed



const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const valid = isSessionValid();

    // If session invalid and not already on login or signup page
    if (!valid && location.pathname !== paths.signin) {
      navigate(paths.signin);
    }
  }, [location]);

  return <Outlet />;
};

export default App;
