import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import bcrypt from 'bcryptjs';

// Récupérer tous les utilisateurs (avec filtrage)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ],
        NOT: {
          id: session.user.id // Exclure l'utilisateur actuel
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        status: true,
        lastSeen: true
      }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Créer un nouvel utilisateur
export async function POST(request) {
  try {
    const { username, email, password, avatarUrl } = await request.json();
    
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'Cet email ou nom d\'utilisateur est déjà utilisé' }, { status: 409 });
    }
    
    // Hacher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        avatarUrl
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        status: true,
        createdAt: true
      }
    });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
