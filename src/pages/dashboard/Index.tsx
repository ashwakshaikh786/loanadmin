import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role_name');

    if (!role) {
      navigate(paths.signin); // fallback to signin
      return;
    }

    switch (role.toLowerCase()) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'manager':
        navigate('/manager/dashboard');
        break;
      case 'employee':
        navigate('/employee/dashboard');
        break;
      default:
        navigate(paths.dashboard); // generic fallback
        break;
    }
  }, [navigate]);

  return null; // or a spinner if needed
};

export default RoleBasedRedirect;
