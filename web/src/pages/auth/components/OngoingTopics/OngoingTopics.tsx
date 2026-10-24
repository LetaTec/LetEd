import { useNavigate } from 'react-router-dom';
import cx from 'classnames/bind';

import { TopicPreviewGrid } from '@components/catalogue/TopicPreviewGrid/TopicPreviewGrid';
import { Heading } from '@components/ui/Heading/Heading';
import { Text } from '@components/ui/Text/Text';
import { AUTH_QUERY_PARAM } from '@constants/auth';
import { CATALOGUE_QUERY_PARAM } from '@constants/catalogue';
import { LANDING_TEXT } from '@constants/landing';
import { SIGN_IN_TOPIC_COUNT } from '@constants/topics';
import { APP_ROUTES } from '@constants/routes';
import type { Topic } from '@services/catalogue';

import styles from './OngoingTopics.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'ongoing-topics-title';

export type OngoingTopicsProps = {
  catalogueTopics: readonly Topic[];
};

// The topics running now, beside the sign-in form. Enrolling or
// pre-registering asks the visitor to register first, then opens that
// topic's payment panel.
export const OngoingTopics = ({ catalogueTopics }: OngoingTopicsProps) => {
  const navigate = useNavigate();

  const handleChooseTopic = (topicId: string) => {
    const destination = `${APP_ROUTES.TOPICS}?${new URLSearchParams({
      [CATALOGUE_QUERY_PARAM.checkout]: topicId,
    })}`;
    navigate(
      `${APP_ROUTES.REGISTER}?${new URLSearchParams({
        [AUTH_QUERY_PARAM.redirectTo]: destination,
      })}`,
    );
  };

  return (
    <section className={cn('panel')} aria-labelledby={TITLE_ID}>
      <Text as="div" variant="eyebrow" tone="accent">
        {LANDING_TEXT.ongoingEyebrow}
      </Text>
      <Heading level={2} variant="item" id={TITLE_ID} className={cn('title')}>
        {LANDING_TEXT.ongoingTitle}
      </Heading>
      <TopicPreviewGrid
        catalogueTopics={catalogueTopics}
        onChooseTopic={handleChooseTopic}
        showSearch={false}
        columns={2}
        limit={SIGN_IN_TOPIC_COUNT}
      />
    </section>
  );
};
