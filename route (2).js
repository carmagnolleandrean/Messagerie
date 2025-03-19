import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';

// Récupérer tous les messages d'une conversation
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return NextResponse.json({ error: 'ID de conversation requis' }, { status: 400 });
    }
    
    // Vérifier que l'utilisateur est membre de la conversation
    const participant = await prisma.participation.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id
        }
      }
    });
    
    if (!participant) {
      return NextResponse.json({ error: 'Accès non autorisé à cette conversation' }, { status: 403 });
    }
    
    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Créer un nouveau message
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const { conversationId, content, isEncrypted = true } = await request.json();
    
    if (!conversationId || !content) {
      return NextResponse.json({ error: 'ID de conversation et contenu requis' }, { status: 400 });
    }
    
    // Vérifier que l'utilisateur est membre de la conversation
    const participant = await prisma.participation.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id
        }
      }
    });
    
    if (!participant) {
      return NextResponse.json({ error: 'Accès non autorisé à cette conversation' }, { status: 403 });
    }
    
    // Créer le message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content,
        isEncrypted
      }
    });
    
    // Mettre à jour la date de dernière modification de la conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
