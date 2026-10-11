import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthDialog } from '@components/auth/AuthDialog/AuthDialog';
import { ModelPaperDialog } from '@components/enquiries/ModelPaperDialog/ModelPaperDialog';
import { AUTH_TEXT, AUTH_VIEW, type AuthView } from '@constants/auth';
import { APP_ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { useAuthDialog } from '@hooks/useAuthDialog';
import { useCatalogue } from '@hooks/useCatalogue';
import { useCourseSelection } from '@hooks/useCourseSelection';
import type { AuthUser } from '@services/auth';
import {
  findBatchContext,
  findSubjectBySlug,
  type Batch,
  type Subject,
} from '@services/catalogue';
import { resolveInternalPath } from '@utils/url';

import { AboutSection } from './components/AboutSection/AboutSection';
import { AiTestDialog } from './components/AiTestDialog/AiTestDialog';
import { AiTestSection } from './components/AiTestSection/AiTestSection';
import { CourseDialog } from './components/CourseDialog/CourseDialog';
import { CoursesSection } from './components/CoursesSection/CoursesSection';
import { CtaSection } from './components/CtaSection/CtaSection';
import { HeroSection } from './components/HeroSection/HeroSection';
import { LearningModelSection } from './components/LearningModelSection/LearningModelSection';
import { ProgramsSection } from './components/ProgramsSection/ProgramsSection';
import { TeamSection } from './components/TeamSection/TeamSection';

type HomeDialog = 'modelPaper' | 'aiTest';

const HomePage = () => {
  const catalogue = useCatalogue();
  const auth = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { view: authView, redirectTo, openAuth, closeAuth } = useAuthDialog();
  const {
    subjectSlug,
    batchId,
    openSubject,
    selectBatch,
    clearBatch,
    closeCourse,
  } = useCourseSelection();
  const [activeDialog, setActiveDialog] = useState<HomeDialog | null>(null);

  const subject = findSubjectBySlug(catalogue.subjects, subjectSlug);
  const batchContext = findBatchContext(catalogue.subjects, batchId);
  const selection =
    batchContext && subject && batchContext.subject.id === subject.id
      ? batchContext
      : null;
  const hasUnknownBatch =
    !catalogue.isLoading && Boolean(batchId) && selection === null;
  const isAuthDialogOpen = authView !== null && !auth.isLoggedIn;

  // A signed-in visitor who lands on an auth URL (refresh, back button) goes
  // straight to where they were heading.
  useEffect(() => {
    if (!auth.isLoggedIn || authView === null) return;

    if (redirectTo) {
      navigate(resolveInternalPath(redirectTo, APP_ROUTES.HOME), {
        replace: true,
      });
    } else {
      closeAuth();
    }
  }, [auth.isLoggedIn, authView, closeAuth, navigate, redirectTo]);

  // Sections render client-side, so honour an incoming #anchor once mounted.
  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
    // Only on first mount — later hash changes are native in-page jumps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenSubject = (nextSubject: Subject) =>
    openSubject(nextSubject.slug);

  const handleSelectBatch = (nextSubjectSlug: string, batch: Batch) =>
    selectBatch(
      nextSubjectSlug,
      batch.id,
      auth.isLoggedIn ? undefined : AUTH_VIEW.register,
    );

  const handleAuthenticated = (user: AuthUser, view: AuthView) => {
    auth.login(user);
    showToast(
      view === AUTH_VIEW.register
        ? AUTH_TEXT.registeredToast
        : AUTH_TEXT.loggedInToast,
    );
  };

  const closeDialog = () => setActiveDialog(null);

  return (
    <>
      <HeroSection
        catalogue={catalogue}
        onOpenSubject={openSubject}
        onSelectBatch={handleSelectBatch}
        onCreateAccount={() => openAuth(AUTH_VIEW.register)}
      />
      <LearningModelSection />
      <AiTestSection onStartSample={() => setActiveDialog('aiTest')} />
      <CoursesSection catalogue={catalogue} onOpenSubject={handleOpenSubject} />
      <ProgramsSection
        onSeeTestFlow={() => setActiveDialog('aiTest')}
        onJoinWaitlist={() => setActiveDialog('modelPaper')}
      />
      <AboutSection />
      <TeamSection />
      <CtaSection onCreateAccount={() => openAuth(AUTH_VIEW.register)} />

      <CourseDialog
        open={subject !== null && !isAuthDialogOpen && activeDialog === null}
        subject={subject}
        selection={selection}
        hasUnknownBatch={hasUnknownBatch}
        onClose={closeCourse}
        onSelectBatch={batch =>
          subject && handleSelectBatch(subject.slug, batch)
        }
        onClearBatch={clearBatch}
        onOpenAuth={openAuth}
        onEnrolmentChange={catalogue.reload}
      />
      <AuthDialog
        view={isAuthDialogOpen ? authView : null}
        onViewChange={openAuth}
        onClose={closeAuth}
        onAuthenticated={handleAuthenticated}
        intent={
          selection
            ? `${selection.topic.title} — ${selection.batch.scheduleLabel}`
            : undefined
        }
      />
      <AiTestDialog
        open={activeDialog === 'aiTest'}
        isLoggedIn={auth.isLoggedIn}
        onClose={closeDialog}
        onCreateProfile={() => {
          closeDialog();
          openAuth(AUTH_VIEW.register);
        }}
      />
      <ModelPaperDialog
        open={activeDialog === 'modelPaper'}
        onClose={closeDialog}
      />
    </>
  );
};

export default HomePage;
