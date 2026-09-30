"use client";

import React, { useContext, useRef } from "react";
import { TransitionContext } from "./transitionProvider";

type TransitionLinkProps = Omit<React.ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  children: React.ReactNode;
};

const TransitionLink = ({ href, children, ...props }: TransitionLinkProps) => {
  const { navigate } = useContext(TransitionContext);
  const fallbackRef = useRef<number | null>(null);

  return (
    <a 
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
        if (fallbackRef.current !== null) window.clearTimeout(fallbackRef.current);
        fallbackRef.current = window.setTimeout(() => {
          if (window.location.pathname !== href) window.location.assign(href);
          fallbackRef.current = null;
        }, 1000);
      }}
      {...props}
    >
      {children}
    </a>
  );
};

export default TransitionLink;