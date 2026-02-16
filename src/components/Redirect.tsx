
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RedirectProps {
  to: string;
}

const Redirect = ({ to }: RedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (to.startsWith('http')) {
      window.location.replace(to);
    } else {
      navigate(to, { replace: true });
    }
  }, [to, navigate]);

  return null;
};

export default Redirect;
