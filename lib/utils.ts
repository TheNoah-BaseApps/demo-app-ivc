import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency() {
    // TODO: Implement formatCurrency
    throw new Error('formatCurrency not implemented');
}
