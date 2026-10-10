import React, { useEffect, useId, useRef } from 'react';
import cx from 'classnames/bind';

import { Heading } from '../Heading/Heading';
import { IconButton } from '../IconButton/IconButton';
import { Text } from '../Text/Text';
import styles from './Modal.module.css';

const cn = cx.bind(styles);

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  closeLabel?: string;
  children: React.ReactNode;
};

// Built on the native <dialog> element: showModal() provides the focus trap,
// Escape handling, inert background and focus return.
export const Modal = ({
  open,
  onClose,
  eyebrow,
  title,
  closeLabel = 'Close',
  children,
}: ModalProps) => {
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
    // The dialog itself is the backdrop; clicking outside the box closes it,
    // and the keyboard path is the native Escape key.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className={cn('modal')}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      {open ? (
        <div className={cn('box')}>
          <IconButton
            icon="close"
            size="lg"
            label={closeLabel}
            className={cn('close')}
            onClick={onClose}
          />
          {eyebrow ? (
            <Text as="div" variant="eyebrow">
              {eyebrow}
            </Text>
          ) : null}
          <Heading
            level={2}
            variant="title"
            id={titleId}
            className={cn('title')}
          >
            {title}
          </Heading>
          {children}
        </div>
      ) : null}
    </dialog>
  );
};
