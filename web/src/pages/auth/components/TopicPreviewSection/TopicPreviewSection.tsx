import { useNavigate } from 'react-router-dom';
import cx from 'classnames/bind';

import { TopicPreviewGrid } from '@components/catalogue/TopicPreviewGrid/TopicPreviewGrid';
import { ButtonRouteLink } from '@components/ui/Button/Button';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { AUTH_QUERY_PARAM } from '@constants/auth';
import { CATALOGUE_QUERY_PARAM } from '@constants/catalogue';
import { LANDING_TEXT } from '@constants/landing';
import { APP_ROUTES } from '@constants/routes';

import styles from './TopicPreviewSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'topic-preview-title';

export type TopicPreviewSectionProps = {
  openTopicIds: ReadonlySet<string>;
};

// Choosing an open topic asks the visitor to register, then returns them to
// that topic's batches.
export const TopicPreviewSection = ({
  openTopicIds,
}: TopicPreviewSectionProps) => {
  const navigate = useNavigate();

  const handleSelectTopic = (topicId: string) => {
    const destination = `${APP_ROUTES.HOME}?${new URLSearchParams({
      [CATALOGUE_QUERY_PARAM.topic]: topicId,
    })}`;
    navigate(
      `${APP_ROUTES.REGISTER}?${new URLSearchParams({
        [AUTH_QUERY_PARAM.redirectTo]: destination,
      })}`,
    );
  };

  return (
    <Section divider labelledBy={TITLE_ID}>
      <SectionHead
        titleId={TITLE_ID}
        title={
          <>
            {LANDING_TEXT.topicsTitle}
            <br />
            <em>{LANDING_TEXT.topicsTitleEmphasis}</em>
          </>
        }
        description={LANDING_TEXT.topicsDescription}
      />
      <TopicPreviewGrid
        openTopicIds={openTopicIds}
        onSelectTopic={handleSelectTopic}
        actionLabel={LANDING_TEXT.topicAction}
      />
      <div className={cn('more')}>
        <ButtonRouteLink
          variant="secondary"
          to={APP_ROUTES.REGISTER}
          endIcon="arrowRight"
        >
          {LANDING_TEXT.seeAllTopics}
        </ButtonRouteLink>
      </div>
    </Section>
  );
};
