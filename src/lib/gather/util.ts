export function querySelectorAll(
  selector: string,
  target: Element | Document = document
): Element[] {
  return [...target.querySelectorAll(selector)];
}

export function querySelector(
  selector: string,
  target: Element | Document = document
): Element | null {
  return target.querySelector(selector);
}

export function removeNonNumericChars(str: string): string {
  return str.replace(/[^\d.]/g, '');
}
