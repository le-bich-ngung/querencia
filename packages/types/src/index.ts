export interface PaginatedResponse<T> {
  data:   T[];
  total:  number;
  page:   number;
  limit:  number;
  hasMore: boolean;
}

export interface ApiResponse<T = unknown> {
  ok:      boolean;
  data?:   T;
  message?: string;
  code?:   string;
}

export type Plan = 'free' | 'pro';
export type QType = 'expiring' | 'permanent';
