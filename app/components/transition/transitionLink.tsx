"use client";

import React, { useContext } from "react";
import { TransitionContext } from "./transitionProvider";

type TransitionLinkProps = Omit<React.ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  children: React.ReactNode;
};

const TransitionLink = ({ href, children, ...props }: TransitionLinkProps) => {
  const { navigate } = useContext(TransitionContext);

  return (
    <a 
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
};

export default TransitionLink;