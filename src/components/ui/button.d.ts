import type { ButtonHTMLAttributes, ComponentType } from 'react';

export const Button: ComponentType<ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: string;
  size?: string;
  asChild?: boolean;
}>;
