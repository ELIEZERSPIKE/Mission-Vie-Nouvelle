import type { HTMLAttributes, ComponentType } from 'react';

export const Badge: ComponentType<HTMLAttributes<HTMLDivElement> & {
  variant?: string;
}>;