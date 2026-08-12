
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RedirectProps {
  to: string;
}

const Redirect = ({ to }: RedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auth links (invite / recovery / magic link) can land on "/" — keep them in the portal
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const hasAuthPayload =
      hash.includes('access_token=') ||
      hash.includes('type=invite') ||
      hash.includes('type=recovery') ||
      hash.includes('error_code=') ||
      new URLSearchParams(search).has('code');

    if (hasAuthPayload) {
      window.location.replace(`/mentorship-portal/set-password${search}${hash}`);
      return;
    }

    if (to.startsWith('http')) {
      window.location.replace(to);
    } else {
      navigate(to, { replace: true });
    }
  }, [to, navigate]);

  return null;
};

export default Redirect;
