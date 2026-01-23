import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global site discount multiplier (20% off = 0.8)
export const SITE_DISCOUNT = 0.8;

// Maximum price cap for all products
export const MAX_PRICE = 399.90;

// Apply site discount to a price and cap at maximum
export function applyDiscount(price: number): number {
  const discountedPrice = price * SITE_DISCOUNT;
  return Math.min(discountedPrice, MAX_PRICE);
}
