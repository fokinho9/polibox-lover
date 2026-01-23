import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global site discount multiplier (20% off = 0.8)
export const SITE_DISCOUNT = 0.8;

// Maximum price cap after discount
export const MAX_PRICE = 399.90;

// Apply site discount to a price with max cap
export function applyDiscount(price: number): number {
  const discounted = price * SITE_DISCOUNT;
  return Math.min(discounted, MAX_PRICE);
}
