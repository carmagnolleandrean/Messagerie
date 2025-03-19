import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware pour la sécurité de l'application
export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Définir les chemins publics (accessibles sans authentification)
  const publicPaths = ['/login', '/register', '/api/auth'];
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
  
  // Vérifier si l'utilisateur est authentifié
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'votre-secret-temporaire-pour-le-developpement'
  });
  
  const isAuthenticated = !!token;
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié et tente d'accéder à une page protégée
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Rediriger vers la page principale si l'utilisateur est authentifié et tente d'accéder à une page publique
  if (isAuthenticated && isPublicPath && !path.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Ajouter des en-têtes de sécurité
  const response = NextResponse.next();
  
  // Protection contre le clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Protection contre le MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Protection XSS
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Politique de sécurité du contenu
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' ws: wss:;"
  );
  
  // Politique de référence
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Strict Transport Security
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  return response;
}

// Configuration des chemins à protéger
export const config = {
  matcher: [
    // Protéger toutes les routes sauf les fichiers statiques
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
