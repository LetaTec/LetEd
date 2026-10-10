import cx from 'classnames/bind';

import { Button } from '@components/ui/Button/Button';
import { Heading } from '@components/ui/Heading/Heading';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { Text } from '@components/ui/Text/Text';
import { AI_TEST_TEXT } from '@constants/home';
import { HOME_SECTION_ID } from '@constants/routes';

import styles from './AiTestSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'ai-test-title';

export type AiTestSectionProps = {
  onStartSample: () => void;
};

export const AiTestSection = ({ onStartSample }: AiTestSectionProps) => {
  const { sheet } = AI_TEST_TEXT;

  return (
    <Section id={HOME_SECTION_ID.aiTest} tone="inverse" labelledBy={TITLE_ID}>
      <div className={cn('grid')}>
        <Reveal>
          <Text as="div" variant="eyebrow" tone="accentInverse">
            {AI_TEST_TEXT.eyebrow}
          </Text>
          <Heading
            level={2}
            variant="feature"
            tone="inverse"
            id={TITLE_ID}
            className={cn('title')}
          >
            {AI_TEST_TEXT.title}
            <br />
            <em>{AI_TEST_TEXT.titleEmphasis}</em>
          </Heading>
          <Text as="p" tone="inverseMuted" className={cn('description')}>
            {AI_TEST_TEXT.description}
          </Text>
          <Button
            variant="secondary"
            tone="inverse"
            endIcon="arrowRight"
            className={cn('action')}
            onClick={onStartSample}
          >
            {AI_TEST_TEXT.action}
          </Button>
        </Reveal>

        {/* Decorative preview of a test paper */}
        <Reveal className={cn('sheet')}>
          <div aria-hidden="true">
            <div className={cn('sheetTop')}>
              <Text variant="label">{sheet.brand}</Text>
              <Text variant="label">{sheet.count}</Text>
            </div>
            <div className={cn('sheetTitle')}>
              {sheet.title}
              <br />
              {sheet.titleEnd}
            </div>
            <ol>
              {sheet.questions.map(question => (
                <li key={question.index} className={cn('question')}>
                  <Text variant="small">
                    {question.index}
                    <span className={cn('questionPrompt')}>
                      {question.prompt}
                    </span>
                  </Text>
                  <Text variant="numeralSm">{question.answer}</Text>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </Section>
  );
};
