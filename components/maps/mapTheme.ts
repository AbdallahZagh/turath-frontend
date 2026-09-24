export type MapThemeColors = {
  background: string;
  border: string;
  foreground: string;
  primary: string;
};

function resolvedToken(name: string): string {
  const node = document.createElement("span");
  node.style.color = `var(${name})`;
  node.hidden = true;
  document.body.appendChild(node);
  const value = getComputedStyle(node).color;
  node.remove();
  return value;
}

export function resolveMapThemeColors(): MapThemeColors {
  return {
    background: resolvedToken("--app-muted"),
    border: resolvedToken("--border"),
    foreground: resolvedToken("--primary-foreground"),
    primary: resolvedToken("--primary"),
  };
}
