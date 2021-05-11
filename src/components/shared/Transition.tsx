import { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';

interface Props {
  show: boolean;
  enter: string;
  enterFrom: string;
  enterTo: string;
  leave: string;
  leaveFrom: string;
  leaveTo: string;
  children: ReactNode;
}

const Transition: React.FC<Props> = ({
  show,
  enter,
  enterFrom,
  enterTo,
  leave,
  leaveFrom,
  leaveTo,
  children,
}) => {
  const enterClasses = enter?.split(' ');
  const enterFromClasses = enterFrom?.split(' ');
  const enterToClasses = enterTo?.split(' ');
  const leaveClasses = leave?.split(' ');
  const leaveFromClasses = leaveFrom?.split(' ');
  const leaveToClasses = leaveTo?.split(' ');

  return (
    <CSSTransition
      unmountOnExit
      in={show}
      addEndListener={(node: Element, done: any) => {
        node.addEventListener('transitionend', done, false);
      }}
      onEnter={(node: Element) => {
        node.classList.add(...enterClasses, ...enterFromClasses);
      }}
      onEntering={(node: Element) => {
        node.classList.remove(...enterFromClasses);
        node.classList.add(...enterToClasses);
      }}
      onEntered={(node: Element) => {
        node.classList.remove(...enterToClasses, ...enterClasses);
      }}
      onExit={(node: Element) => {
        node.classList.add(...leaveClasses, ...leaveFromClasses);
      }}
      onExiting={(node: Element) => {
        node.classList.remove(...leaveFromClasses);
        node.classList.add(...leaveToClasses);
      }}
      onExited={(node: Element) => {
        node.classList.remove(...leaveToClasses, ...leaveClasses);
      }}
    >
      {children}
    </CSSTransition>
  );
};

export default Transition;
