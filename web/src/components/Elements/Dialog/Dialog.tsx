import { Dialog as DialogComponent, Transition } from '@headlessui/react';
// import 'intersection-observer';
import type { FC, MutableRefObject, ReactNode } from 'react';
import { Fragment } from 'react';

interface IDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  initialFocus?: MutableRefObject<null>;
};

export const Dialog: FC<IDialogProps> = ({ isOpen, onClose, children, initialFocus }) => (
  <>
    <Transition.Root show={isOpen} as={Fragment}>
      <DialogComponent
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={isOpen}
        onClose={onClose}
        initialFocus={initialFocus}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogComponent.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {children}
          </Transition.Child>
        </div>
      </DialogComponent>
    </Transition.Root>
  </>
);

export const DialogTitle = DialogComponent.Title;

export const DialogDescription = DialogComponent.Description;