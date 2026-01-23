import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global site discount multiplier (20% off = 0.8)
export const SITE_DISCOUNT = 0.8;

// Apply site discount to a price
export function applyDiscount(price: number): number {
  return price * SITE_DISCOUNT;
}
