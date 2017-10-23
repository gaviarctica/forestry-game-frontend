import React from 'react';
import { CSSTransition } from 'react-transition-group';

export const FadeInFadeOut = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={700}
    classNames="fade-in-fade-out"
  >
    {children}
  </CSSTransition>
);

export const TranslateDown = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={700}
    classNames="translate-down"
  >
    {children}
  </CSSTransition>
);

export const TranslateRight = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={700}
    classNames="translate-right"
  >
    {children}
  </CSSTransition>
);

export const TranslateLeft = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={700}
    classNames="translate-left"
  >
    {children}
  </CSSTransition>
);
