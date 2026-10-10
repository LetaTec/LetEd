import { Link } from 'react-router-dom';
import cx from 'classnames/bind';

import { BrandLogo } from '@components/brand/BrandLogo/BrandLogo';
import { ButtonBase } from '@components/ui/ButtonBase/ButtonBase';
import { Container } from '@components/ui/Container/Container';
import { Text } from '@components/ui/Text/Text';
import { AUTH_VIEW } from '@constants/auth';
import { BRAND, FOOTER_COLUMNS, FOOTER_STUDENT_TEXT } from '@constants/home';
import { APP_ROUTES, toSectionHref } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useAuthDialog } from '@hooks/useAuthDialog';

import styles from './SiteFooter.module.css';

const cn = cx.bind(styles);

export const SiteFooter = () => {
  const { isLoggedIn } = useAuth();
  const { openAuth } = useAuthDialog();

  return (
    <footer className={cn('footer')}>
      <Container>
        <div className={cn('top')}>
          <div>
            <BrandLogo size="lg" />
            <Text as="p" tone="inverseMuted" className={cn('lead')}>
              {BRAND.footerLead}
            </Text>
          </div>

          {FOOTER_COLUMNS.map(column => (
            <nav
              key={column.title}
              aria-label={column.title}
              className={cn('column')}
            >
              <Text
                as="div"
                variant="label"
                tone="accentInverse"
                className={cn('columnTitle')}
              >
                {column.title}
              </Text>
              {column.links.map(link => (
                <a
                  key={link.label}
                  href={`${APP_ROUTES.HOME}${toSectionHref(link.sectionId)}`}
                  className={cn('link')}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ))}

          <nav aria-label={FOOTER_STUDENT_TEXT.title} className={cn('column')}>
            <Text
              as="div"
              variant="label"
              tone="accentInverse"
              className={cn('columnTitle')}
            >
              {FOOTER_STUDENT_TEXT.title}
            </Text>
            {isLoggedIn ? (
              <Link to={APP_ROUTES.MY_LEARNING} className={cn('link')}>
                {FOOTER_STUDENT_TEXT.myLearning}
              </Link>
            ) : (
              <>
                <ButtonBase
                  className={cn('link')}
                  onClick={() => openAuth(AUTH_VIEW.login)}
                >
                  {FOOTER_STUDENT_TEXT.login}
                </ButtonBase>
                <ButtonBase
                  className={cn('link')}
                  onClick={() => openAuth(AUTH_VIEW.register)}
                >
                  {FOOTER_STUDENT_TEXT.signUp}
                </ButtonBase>
              </>
            )}
          </nav>
        </div>

        <div className={cn('bottom')}>
          <span>{BRAND.copyright}</span>
          <span>{BRAND.footerNote}</span>
        </div>
      </Container>
    </footer>
  );
};
