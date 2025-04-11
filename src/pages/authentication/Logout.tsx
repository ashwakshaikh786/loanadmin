import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session
    sessionStorage.clear();

    // Optional delay before redirecting
    const timer = setTimeout(() => {
      navigate(paths.signin);
    }, 500); // 0.5 second delay

    return () => clearTimeout(timer); // Cleanup
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
