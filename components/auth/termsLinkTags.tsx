import type { ReactNode } from "react";

const LINK_CLASS = "text-primary font-semibold underline-offset-4 hover:underline";

function legalLink(href: string) {
  function LegalLink(chunks: ReactNode): ReactNode {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={LINK_CLASS}>
        {chunks}
      </a>
    );
  }
  return LegalLink;
}

/**
 * `t.rich` tags for the sign-up terms checkbox. The pages open in a new tab so the
 * half-filled form is not lost.
 */
export const TERMS_LINK_TAGS = {
  terms: legalLink("/legal/terms"),
  privacy: legalLink("/legal/privacy"),
};
