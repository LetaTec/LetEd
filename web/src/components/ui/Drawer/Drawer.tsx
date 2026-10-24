import React, { useEffect, useId, useRef } from 'react';
import cx from 'classnames/bind';

import { Heading } from '../Heading/Heading';
import { IconButton } from '../IconButton/IconButton';
import { Text } from '../Text/Text';
import styles from './Drawer.module.css';

const cn = cx.bind(styles);

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  closeLabel?: string;
  children: React.ReactNode;
  // Pinned to the bottom of the panel, e.g. the main action
  footer?: React.ReactNode;
};

// A panel that slides in from the right over a dimmed page. Built on the
// native <dialog> element like Modal: showModal() provides the focus trap,
// Escape handling, inert background and focus return. The page behind does
// not scroll while the panel is open.
export const Drawer = ({
  open,
  onClose,
  eyebrow,
  title,
  closeLabel = 'Close',
  children,
  footer,
}: DrawerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    // The dialog fills the screen and is the backdrop; clicking beside the
    // panel closes it, and the keyboard path is the native Escape key.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className={cn('drawer')}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      {open ? (
        <div className={cn('panel')}>
          <div className={cn('header')}>
            <div className={cn('heading')}>
              {eyebrow ? (
                <Text as="div" variant="eyebrow" tone="accent">
                  {eyebrow}
                </Text>
              ) : null}
              <Heading level={2} variant="title" id={titleId}>
                {title}
              </Heading>
            </div>
            <IconButton
              icon="close"
              size="lg"
              label={closeLabel}
              onClick={onClose}
            />
          </div>
          <div className={cn('body')}>{children}</div>
          {footer ? <div className={cn('footer')}>{footer}</div> : null}
        </div>
      ) : null}
    </dialog>
  );
};
