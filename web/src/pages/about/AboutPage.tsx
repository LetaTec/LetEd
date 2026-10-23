import { ClosingCta } from '@components/brand/ClosingCta/ClosingCta';
import { ABOUT_PAGE_TEXT } from '@constants/about';
import { APP_ROUTES, HOME_SECTION_ID, toPageSection } from '@constants/routes';

import { AboutHero } from './components/AboutHero/AboutHero';
import { ApproachSection } from './components/ApproachSection/ApproachSection';
import { InspirationSection } from './components/InspirationSection/InspirationSection';
import { MotiveSection } from './components/MotiveSection/MotiveSection';
import { TutorsSection } from './components/TutorsSection/TutorsSection';

const { cta } = ABOUT_PAGE_TEXT;

const AboutPage = () => (
  <>
    <AboutHero />
    <MotiveSection />
    <InspirationSection />
    <ApproachSection />
    <TutorsSection />
    <ClosingCta
      titleId="about-cta-title"
      eyebrow={cta.eyebrow}
      title={cta.title}
      titleEmphasis={cta.titleEmphasis}
      actionLabel={cta.action}
      to={toPageSection(APP_ROUTES.HOME, HOME_SECTION_ID.topics)}
    />
  </>
);

export default AboutPage;
