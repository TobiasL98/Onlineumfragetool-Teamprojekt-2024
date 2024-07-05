import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

function authenticate(request: NextRequest) {
	const session = cookies().get("session");
	if (session) {
		const sessionKey = process.env.NEXT_PUBLIC_SESSION_SECRET;
		if (sessionKey && sessionKey == session.value) {
			console.log(request.url);
			return true;
		} else {
			console.log(
				`session did not equal key key: ${sessionKey}, session: ${session.value}`,
			);
			return false;
		}
	} else {
		console.log("no session found");
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const authenticated = authenticate(request);
	if (request.nextUrl.pathname.startsWith("/admin")) {
		if (authenticated) {
			return;
		} else {
			return Response.redirect(new URL("/login", request.url));
		}
	} else {
		if (authenticated) {
			return Response.redirect(new URL("/admin", request.url));
		} else {
			return;
		}
	}
}

export const config = {
	matcher: ["/admin/:path*", "/login", "/admin"],
};
