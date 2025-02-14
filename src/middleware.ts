import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const locales = ['en', 'de'];
export const localePrefix = 'as-needed';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales });

const intlMiddleware = createMiddleware({
	locales,
	localePrefix,
	defaultLocale: 'en',
});

export default function middleware(request: NextRequest) {
	const intlResponse = intlMiddleware(request);

	const token = request.cookies.get('session_token')?.value;
	const role = request.cookies.get('roleName')?.value;
	const url = new URL(request.url);

	// Protect admin and student pages
	if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/student')) {
		if (!token) {
			// Redirect to login if no session token is found
			return NextResponse.redirect(new URL('/login', request.url));
		}

		// Redirect if an admin tries to access student pages
		if (url.pathname.startsWith('/student') && role !== 'student') {
			return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
		}

		// Redirect if a student tries to access admin pages
		if (url.pathname.startsWith('/admin') && role !== 'admin') {
			return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
		}
	}

	return intlResponse || NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next|.*\\..*).*)'],
};
