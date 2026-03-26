import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create-meeting/:path*",
    "/availability/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/edit-meeting/:path*",
  ],
};
