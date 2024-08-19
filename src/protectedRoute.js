import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { allowedRoles } from './roleConfig';

const matchRoutePattern = (pattern, path) => {
  const regex = new RegExp(pattern.replace(/\/\*/g, '(/.*)?').replace(/:\w+/g, '\\w+'));
  console.log('Pattern:', pattern, 'Path:', path, 'Matches:', regex.test(path));
  return regex.test(path);
};

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token")
  const jabatan = localStorage.getItem("jabatan");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const currentPath = location.pathname;

    let isRouteAllowed = false;
    for (const [basePath, roles] of Object.entries(allowedRoles)) {
      if (typeof roles === 'object') {
        const matchingPattern = Object.keys(roles).find(pattern =>
          matchRoutePattern(pattern, currentPath)
        );
        if (matchingPattern) {
          isRouteAllowed = roles[matchingPattern].includes(jabatan);
          break;
        }
      } else if (basePath === currentPath) {
        isRouteAllowed = roles.includes(jabatan);
        break;
      }
    }

    if (!isRouteAllowed) {
      navigate('/NotFound', { replace: true });
    }
  }, [token, jabatan, location, navigate]);

  if (!token || !allowedRoles) {
    return null; // Or a loader if needed
  }

  return element;
};

export default ProtectedRoute;
