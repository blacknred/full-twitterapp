import type { FC } from 'react';
import { cloneElement, useEffect, useRef } from 'react';

import { Button } from '@/components/Elements/Button';
import { Dialog, DialogTitle } from './Dialog';
import { useDisclosure } from '@/hooks/useDisclosure';

export interface IConfirmationDialogProps {
  triggerButton: React.ReactElement;
  confirmButton: React.ReactElement;
  title: string;
  body?: string;
  isDone?: boolean;
};

export const ConfirmationDialog: FC<IConfirmationDialogProps> = ({
  triggerButton,
  confirmButton,
  title,
  body = '',
  isDone = false,
}) => {
  const { close, open, isOpen } = useDisclosure();
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    isDone && close();
  }, [isDone, close]);

  return (
    <>
      {cloneElement(triggerButton, { onClick: open })}
      <Dialog isOpen={isOpen} onClose={close} initialFocus={cancelButtonRef}>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </DialogTitle>
              {body && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{body}</p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-col space-x-2 justify-center">
            <Button
              type="button"
              variant="inverse"
              className="w-full inline-flex justify-center rounded-md border focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={close}
              ref={cancelButtonRef}
            >
              {'Cancel'}
            </Button>
            {confirmButton}
          </div>
        </div>
      </Dialog>
    </>
  );
};
