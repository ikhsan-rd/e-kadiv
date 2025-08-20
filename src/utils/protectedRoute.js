import React,{ useEffect,useState } from 'react';
import { Navigate,useLocation,useNavigate } from 'react-router-dom';
import { allowedRoles } from './roleConfig';

const matchRoutePattern = (pattern,path) =>
{
  const regex = new RegExp(pattern.replace(/\/\*/g,'(/.*)?').replace(/:\w+/g,'\\w+'));
  return regex.test(path);
};

const ProtectedRoute = ({ element }) =>
{
  const [isRedirecting,setIsRedirecting] = useState(true);
  const currentJabatan = sessionStorage.getItem("jabatan");
  const currentToken = sessionStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() =>
  {
    const currentPath = location.pathname;

    if (!currentToken)
    {
      if (currentPath === '/login' || currentPath === '/dashboard')
      {
        setIsRedirecting(false);
      } else
      {
        navigate('/login');
      }
    } else
    {
      let isRouteAllowed = false;
      for (const [basePath,roles] of Object.entries(allowedRoles))
      {
        if (typeof roles === 'object')
        {
          const matchingPattern = Object.keys(roles).find(pattern =>
            matchRoutePattern(pattern,currentPath)
          );
          if (matchingPattern)
          {
            isRouteAllowed = roles[matchingPattern].includes(currentJabatan);
            break;
          }
        } else if (basePath === currentPath)
        {
          isRouteAllowed = roles.includes(currentJabatan);
          break;
        }
      }

      if (!isRouteAllowed)
      {
        navigate('/NotFound',{ replace: true });
      } else
      {
        setIsRedirecting(false);
      }
    }
  },[currentToken,currentJabatan,location,navigate]);

  if (isRedirecting)
  {
    return null;
  }

  return element;
};

export default ProtectedRoute;
