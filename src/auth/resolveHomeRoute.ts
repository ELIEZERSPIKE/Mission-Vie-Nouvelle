// src/auth/resolveHomeRoute.ts
export function resolveHomeRoute(roles?: string[] | null): string {
  if (!roles || !Array.isArray(roles)) return '/student';
  if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) return '/admin/programs';
  if (roles.includes('TEACHER')) return '/admin/academic-years';
  return '/student';
}