import { NextResponse } from 'next/server';
import rateLimit from './rate-limit';

// Middleware pour la protection contre les attaques par force brute
const loginLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Nombre maximum d'utilisateurs par intervalle
  limit: 5, // 5 tentatives par minute
});

// Middleware pour la protection contre les attaques par déni de service
const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000,
  limit: 100, // 100 requêtes par minute
});

export async function protectAgainstBruteForce(req) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    await loginLimiter.check(NextResponse.next(), ip);
    return null;
  } catch {
    return NextResponse.json(
      { error: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.' },
      { status: 429 }
    );
  }
}

export async function protectAgainstDDoS(req) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    await apiLimiter.check(NextResponse.next(), ip);
    return null;
  } catch {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
      { status: 429 }
    );
  }
}

// Fonction pour valider et nettoyer les entrées utilisateur
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Échapper les caractères spéciaux HTML
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Fonction pour valider les emails
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fonction pour valider les mots de passe
export function validatePassword(password) {
  // Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Fonction pour valider les noms d'utilisateur
export function validateUsername(username) {
  // Lettres, chiffres, tirets et underscores, entre 3 et 20 caractères
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

// Protection contre les injections SQL
export function preventSQLInjection(input) {
  if (typeof input !== 'string') return input;
  
  // Liste de mots-clés SQL courants à détecter
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 
    'ALTER', 'CREATE', 'TRUNCATE', 'UNION', 'JOIN',
    'WHERE', 'FROM', 'INTO', 'EXEC', 'EXECUTE'
  ];
  
  // Vérifier si l'entrée contient des mots-clés SQL suspects
  const containsSQLKeywords = sqlKeywords.some(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(input)
  );
  
  if (containsSQLKeywords) {
    throw new Error('Entrée potentiellement dangereuse détectée');
  }
  
  return input;
}

// Protection contre les attaques XSS
export function preventXSS(input) {
  if (typeof input !== 'string') return input;
  
  // Détecter les scripts potentiels
  const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const hasScript = scriptPattern.test(input);
  
  if (hasScript) {
    throw new Error('Contenu potentiellement dangereux détecté');
  }
  
  return sanitizeInput(input);
}
