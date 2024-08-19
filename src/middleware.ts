import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPrivatePath = ["/profile", "/my-addresses", "/wishlist", "/checkout"];
  const isPrivate = isPrivatePath.includes(path);
  const usr = JSON.parse(request.cookies.get("vlipi-user")?.value || "{}");
  const access = request.cookies.get("vlipi-access")?.value;
  // console.log(
  //   `\n\n ~ middleware ~ access:`,
  //   access,
  //   isPrivate,
  //   request?.nextUrl?.pathname,
  //   usr,
  // )
  const hasToken = access && usr?.role === "User";
  if (isPrivate && !hasToken) {
    return NextResponse.redirect(new URL("/", request.url));
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/profile", "/my-addresses", "/wishlist", "/checkout", "/ebook"],
};
