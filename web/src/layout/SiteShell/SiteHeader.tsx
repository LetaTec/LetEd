import { useEffect, useId, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cx from 'classnames/bind';

import { BrandLogo } from '@components/brand/BrandLogo/BrandLogo';
import { Button, ButtonRouteLink } from '@components/ui/Button/Button';
import { Container } from '@components/ui/Container/Container';
import { IconButton } from '@components/ui/IconButton/IconButton';
import { AUTH_TEXT, AUTH_VIEW } from '@constants/auth';
import { HEADER_TEXT, NAV_LINKS } from '@constants/home';
import { APP_ROUTES, toSectionHref } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { useAuthDialog } from '@hooks/useAuthDialog';
import { logoutStudent } from '@services/auth';

import styles from './SiteHeader.module.css';

const cn = cx.bind(styles);

export const SiteHeader = () => {
  const { isLoggedIn, clearSession } = useAuth();
  const { showToast } = useToast();
  const { openAuth } = useAuthDialog();
  const location = useLocation();
  const navigate = useNavigate();
  const navId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutStudent();

      // Leave protected pages before clearing the session so the route guard
      // does not bounce the student to the sign-in dialog. flushSync commits
      // the navigation immediately instead of as a deferred transition.
      if (location.pathname !== APP_ROUTES.HOME) {
        await navigate(APP_ROUTES.HOME, { flushSync: true });
      }

      clearSession();
      showToast(AUTH_TEXT.loggedOutToast);
    } catch (error) {
      console.error('[auth] logout failed', error);
      showToast(AUTH_TEXT.logoutErrorToast, 'error');
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  const openAuthFromMenu = (
    view: (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW],
  ) => {
    setIsMenuOpen(false);
    openAuth(view);
  };

  const accountActions = isLoggedIn ? (
    <>
      <ButtonRouteLink
        variant="plain"
        to={APP_ROUTES.MY_LEARNING}
        onClick={() => setIsMenuOpen(false)}
      >
        {HEADER_TEXT.myLearning}
      </ButtonRouteLink>
      <Button variant="primary" loading={isLoggingOut} onClick={handleLogout}>
        {HEADER_TEXT.logout}
      </Button>
    </>
  ) : (
    <>
      <Button variant="plain" onClick={() => openAuthFromMenu(AUTH_VIEW.login)}>
        {HEADER_TEXT.login}
      </Button>
      <Button
        variant="primary"
        onClick={() => openAuthFromMenu(AUTH_VIEW.register)}
      >
        {HEADER_TEXT.signUp}
      </Button>
    </>
  );

  return (
    <header className={cn('header')}>
      <Container className={cn('nav')}>
        <Link
          to={APP_ROUTES.HOME}
          className={cn('logoLink')}
          aria-label={HEADER_TEXT.homeLabel}
        >
          <BrandLogo />
        </Link>

        <nav
          id={navId}
          aria-label={HEADER_TEXT.primaryNavigation}
          className={cn('links', { linksOpen: isMenuOpen })}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.sectionId}
              href={`${APP_ROUTES.HOME}${toSectionHref(link.sectionId)}`}
              className={cn('link')}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className={cn('menuActions')}>{accountActions}</div>
        </nav>

        <div className={cn('actions')}>{accountActions}</div>

        <IconButton
          icon={isMenuOpen ? 'close' : 'menu'}
          size="lg"
          label={isMenuOpen ? HEADER_TEXT.closeMenu : HEADER_TEXT.openMenu}
          aria-expanded={isMenuOpen}
          aria-controls={navId}
          className={cn('menuButton')}
          onClick={() => setIsMenuOpen(open => !open)}
        />
      </Container>
    </header>
  );
};
