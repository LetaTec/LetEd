import cx from 'classnames/bind';

import { Text } from '@components/ui/Text/Text';
import { TEST_PAPER_PREVIEW as sheet } from '@constants/assessment';

import styles from './TestPaperPreview.module.css';

const cn = cx.bind(styles);

// Decorative, tilted preview of a generated MCQ test paper. Hidden from
// assistive technology because it carries no interactive content.
export const TestPaperPreview = () => (
  <div className={cn('sheet')} aria-hidden="true">
    <div className={cn('sheetTop')}>
      <Text variant="label">{sheet.brand}</Text>
      <Text variant="label">{sheet.count}</Text>
    </div>
    <div className={cn('sheetTitle')}>
      {sheet.title}
      <br />
      {sheet.titleEnd}
    </div>
    <div className={cn('meta')}>
      {sheet.meta.map(item => (
        <Text key={item} variant="label" tone="muted">
          {item}
        </Text>
      ))}
    </div>
    <Text as="p" variant="small" tone="muted" className={cn('instruction')}>
      {sheet.instruction}
    </Text>
    <ol className={cn('questions')}>
      {sheet.questions.map(question => (
        <li key={question.index} className={cn('question')}>
          <div className={cn('questionHead')}>
            <Text variant="numeralSm">{question.index}</Text>
            <Text variant="strong" className={cn('prompt')}>
              {question.prompt}
            </Text>
            <Text variant="label" tone="muted">
              {sheet.marksLabel}
            </Text>
          </div>
          <ul className={cn('options')}>
            {question.options.map(option => (
              <li key={option.key} className={cn('option')}>
                <span
                  className={cn('bubble', {
                    bubbleSelected: option.key === question.selected,
                  })}
                >
                  {option.key}
                </span>
                <Text variant="small">{option.label}</Text>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
    <div className={cn('sheetFooter')}>
      <Text variant="label" tone="muted">
        {sheet.progress}
      </Text>
      <Text variant="label" tone="muted">
        {sheet.timeLeft}
      </Text>
    </div>
  </div>
);
