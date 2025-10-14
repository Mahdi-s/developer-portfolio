// Authentication temporarily disabled - direct access to admin routes allowed

export function middleware(req: any) {
  // No authentication required - allow all requests
  return
}

export const config = {
  // Disable matcher to allow unrestricted access
  matcher: []
}
