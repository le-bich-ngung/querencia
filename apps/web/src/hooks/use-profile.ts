/**
 * useProfile — lấy thông tin user + quota breakdown từ API
 * quota: { expiring: number, permanent: number, isPro: boolean }
 */
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

const fetcher = ([url, token]: [string, string]) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());

export function useProfile() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const { data: user, mutate: mutateUser } = useSWR(
    token ? [(process.env.NEXT_PUBLIC_API_URL ?? 'https://querencia.fly.dev/api/v1') + '/auth/me', token] : null,
    fetcher,
  );

  const { data: quota } = useSWR(
    token ? [(process.env.NEXT_PUBLIC_API_URL ?? 'https://querencia.fly.dev/api/v1') + '/tools/quota', token] : null,
    fetcher,
    { refreshInterval: 60_000 },
  );

  return {
    user,
    quota: quota as {
      expiring:  number;
      permanent: number;
      isPro:     boolean;
      used:      number;
      limit:     number;
    } | undefined,
    token,
    mutateUser,
  };
}
