import cx from 'classnames/bind';

import { ButtonRouteLink } from '@components/ui/Button/Button';
import { Heading } from '@components/ui/Heading/Heading';
import { Section } from '@components/ui/Section/Section';
import { Text } from '@components/ui/Text/Text';
import { PAGE_TEXT } from '@constants/pages';
import { APP_ROUTES } from '@constants/routes';

import styles from './NotFoundPage.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'not-found-title';

const NotFoundPage = () => (
  <Section labelledBy={TITLE_ID} className={cn('page')}>
    <div className={cn('content')}>
      <Text as="div" variant="eyebrow">
        {PAGE_TEXT.notFoundEyebrow}
      </Text>
      <Heading level={1} variant="display" id={TITLE_ID}>
        {PAGE_TEXT.notFoundTitle}
        <br />
        <em>{PAGE_TEXT.notFoundTitleEmphasis}</em>
      </Heading>
      <Text as="p" tone="muted">
        {PAGE_TEXT.notFoundMessage}
      </Text>
      <div>
        <ButtonRouteLink to={APP_ROUTES.HOME} endIcon="arrowRight">
          {PAGE_TEXT.backHome}
        </ButtonRouteLink>
      </div>
    </div>
  </Section>
);

export default NotFoundPage;
