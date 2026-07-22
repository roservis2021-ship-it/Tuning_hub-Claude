export function isInternalVisitor(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c === "th_internal=1");
}
