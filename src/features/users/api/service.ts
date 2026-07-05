// ============================================================
// User Service — Data Access Layer
// ============================================================
// This is the ONLY file you modify when connecting to your backend.
// Queries (queries.ts) and components import from here — they never change.
//
// Pick your pattern and replace the function bodies below:
//
// 1. Server Actions + ORM (Prisma / Drizzle / Supabase)
//    → Add 'use server' at the top of this file
//    → Call your ORM directly in each function
//
// 2. Route Handlers + ORM
//    → import { apiClient } from '@/lib/api-client'
//    → return apiClient<UsersResponse>('/users?...')
//    → Replace mock calls in route handlers (src/app/api/users/) with ORM
//
// 3. BFF — Route Handlers proxy to external backend (Laravel, Go, etc.)
//    → import { apiClient } from '@/lib/api-client'
//    → return apiClient<UsersResponse>('/users?...')
//    → Route handlers proxy requests to your external backend service
//
// 4. Direct external API (frontend-only, no Next.js backend)
//    → const res = await fetch('https://your-api.com/users?...')
//    → return res.json()
//
// Current: Mock (in-memory fake data for demo/prototyping)
// ============================================================

import { apiClient } from '@/lib/api-client';
import type { UserFilters, UsersResponse, UserMutationPayload } from './types';

export async function getUsers(filters: UserFilters): Promise<UsersResponse> {
  const query = new URLSearchParams();

  if (filters.page) query.set('page', String(filters.page));
  if (filters.limit) query.set('limit', String(filters.limit));
  if (filters.roles) query.set('roles', filters.roles);
  if (filters.search) query.set('search', filters.search);
  if (filters.sort) query.set('sort', filters.sort);

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiClient<UsersResponse>(`/users${suffix}`);
}

export async function createUser(data: UserMutationPayload) {
  return apiClient('/users', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateUser(id: number, data: UserMutationPayload) {
  return apiClient(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteUser(id: number) {
  return apiClient(`/users/${id}`, {
    method: 'DELETE'
  });
}
