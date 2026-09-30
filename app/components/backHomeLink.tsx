import type { ReactNode } from "react";
import TransitionLink from "./transition/transitionLink";

type BackHomeLinkProps = {
  className?: string;
  children?: ReactNode;
};

export default function BackHomeLink({ className, children = "Home" }: BackHomeLinkProps) {
  return (
    <TransitionLink href="/" className={className}>
      {children}
    </TransitionLink>
  );
}
