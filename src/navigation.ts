import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'de'];
export const localePrefix = '';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales });
