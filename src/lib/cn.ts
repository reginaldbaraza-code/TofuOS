/**
 * Simple classNames helper for conditional and combined Tailwind/design-system classes.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
