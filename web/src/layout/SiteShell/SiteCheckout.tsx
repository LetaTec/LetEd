import { CheckoutPanel } from '@components/payments/CheckoutPanel/CheckoutPanel';
import { TOPIC_PREVIEWS } from '@constants/topics';
import { useCatalogue } from '@hooks/useCatalogue';
import { useCheckout } from '@hooks/useCheckout';
import { listTopics } from '@services/catalogue';

// The payment panel for the topic named in ?checkout=, on any signed-in
// page. Keeping it in the URL means it survives signing up from the
// sign-in page and opens straight after.
export const SiteCheckout = () => {
  const { checkoutTopicId, closeCheckout } = useCheckout();
  const { subjects } = useCatalogue();

  if (!checkoutTopicId) return null;

  const topic = listTopics(subjects).find(
    context => context.topic.id === checkoutTopicId,
  )?.topic;
  const preview = TOPIC_PREVIEWS.find(
    item => item.catalogueTopicId === checkoutTopicId,
  );

  if (!topic || !preview) return null;

  return (
    <CheckoutPanel
      key={checkoutTopicId}
      preview={preview}
      topic={topic}
      onClose={closeCheckout}
    />
  );
};
