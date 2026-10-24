import cx from 'classnames/bind';

import { CheckoutPanel } from '@components/payments/CheckoutPanel/CheckoutPanel';
import { Button } from '@components/ui/Button/Button';
import { Drawer } from '@components/ui/Drawer/Drawer';
import { Spinner } from '@components/ui/Spinner/Spinner';
import { Text } from '@components/ui/Text/Text';
import { CHECKOUT_TEXT } from '@constants/payments';
import { TOPIC_PREVIEWS } from '@constants/topics';
import { useCatalogue } from '@hooks/useCatalogue';
import { useCheckout } from '@hooks/useCheckout';
import { listTopics } from '@services/catalogue';

import styles from './SiteCheckout.module.css';

const cn = cx.bind(styles);

// The payment panel for the topic named in ?checkout=, on any signed-in
// page. Keeping it in the URL means it survives signing up from the
// sign-in page and opens straight after. The panel opens at once and waits
// for the catalogue if it is still loading.
export const SiteCheckout = () => {
  const { checkoutTopicId, closeCheckout } = useCheckout();
  const { subjects, isLoading, reload } = useCatalogue();

  if (!checkoutTopicId) return null;

  const preview = TOPIC_PREVIEWS.find(
    item => item.catalogueTopicId === checkoutTopicId,
  );
  if (!preview) return null;

  const topic = listTopics(subjects).find(
    context => context.topic.id === checkoutTopicId,
  )?.topic;

  if (topic) {
    return (
      <CheckoutPanel
        key={checkoutTopicId}
        preview={preview}
        topic={topic}
        onClose={closeCheckout}
      />
    );
  }

  return (
    <Drawer
      open
      onClose={closeCheckout}
      eyebrow={preview.level}
      title={preview.title}
      closeLabel={CHECKOUT_TEXT.close}
    >
      {isLoading ? (
        <div className={cn('status')} role="status">
          <Spinner tone="muted" />
          <Text variant="small" tone="muted">
            {CHECKOUT_TEXT.loadingTopic}
          </Text>
        </div>
      ) : (
        <div className={cn('status')}>
          <Text as="p" variant="small">
            {CHECKOUT_TEXT.loadFailedTopic}
          </Text>
          <Button variant="secondary" onClick={reload}>
            {CHECKOUT_TEXT.retry}
          </Button>
        </div>
      )}
    </Drawer>
  );
};
