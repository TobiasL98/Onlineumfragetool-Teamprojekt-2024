import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	console.log("my time!");
	const session = cookies().get("session");
	if (session) {
		const sessionKey = process.env.NEXT_PUBLIC_SESSION_SECRET;
		if (sessionKey && sessionKey == session.value) {
			console.log(
				`authenticated key key: ${sessionKey}, session: ${session.value}`,
			);
			return;
		} else {
			console.log(
				`session did not equal key key: ${sessionKey}, session: ${session.value}`,
			);
			return Response.redirect(new URL("/login", request.url));
		}
	} else {
		console.log("no session found");
		return Response.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: "/admin/:path*",
};
