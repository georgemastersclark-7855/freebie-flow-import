
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RedirectProps {
  to: string;
}

const Redirect = ({ to }: RedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auth links (invite, recovery, sign-in code) can fall back to the Site URL and
    // land on "/". Keep them in the portal: invite and recovery sessions finish on
    // set-password, everything else (including expired links) on the confirm page.
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
    const searchParams = new URLSearchParams(search);
    const type = hashParams.get('type') ?? searchParams.get('type');
    const hasSession = hashParams.has('access_token');
    const hasAuthPayload =
      hasSession ||
      hashParams.has('error_code') ||
      searchParams.has('error_code') ||
      searchParams.has('token_hash') ||
      searchParams.has('code');

    if (hasAuthPayload) {
      const target = hasSession && (type === 'invite' || type === 'recovery') ? 'set-password' : 'auth/confirm';
      window.location.replace(`/mentorship-portal/${target}${search}${hash}`);
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
