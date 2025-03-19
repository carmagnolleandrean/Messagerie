import { Server } from 'socket.io';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import prisma from '@/lib/prisma';

// Map pour stocker les connexions actives des utilisateurs
const userSocketMap = new Map();

export default async function SocketHandler(req, res) {
  // Vérifier si le serveur Socket.io est déjà initialisé
  if (res.socket.server.io) {
    console.log('Socket.io déjà initialisé');
    res.end();
    return;
  }

  // Obtenir la session utilisateur
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const userId = session.user.id;

  // Initialiser le serveur Socket.io
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  res.socket.server.io = io;

  // Middleware d'authentification
  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error('Non autorisé'));
    }
    
    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return next(new Error('Utilisateur non trouvé'));
    }
    
    socket.userId = userId;
    next();
  });

  // Gestion des connexions
  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log(`Utilisateur connecté: ${userId}`);
    
    // Stocker la connexion de l'utilisateur
    userSocketMap.set(userId, socket.id);
    
    // Mettre à jour le statut de l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: { 
        status: 'online',
        lastSeen: new Date()
      },
    });
    
    // Informer les contacts que l'utilisateur est en ligne
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { userId: userId, status: 'accepted' },
          { contactId: userId, status: 'accepted' }
        ]
      },
      select: {
        userId: true,
        contactId: true
      }
    });
    
    // Notifier les contacts connectés
    contacts.forEach(contact => {
      const contactId = contact.userId === userId ? contact.contactId : contact.userId;
      const contactSocketId = userSocketMap.get(contactId);
      
      if (contactSocketId) {
        io.to(contactSocketId).emit('user_status', { userId, status: 'online' });
      }
    });
    
    // Rejoindre les salles de conversation
    const conversations = await prisma.participation.findMany({
      where: { userId },
      select: { conversationId: true }
    });
    
    conversations.forEach(conv => {
      socket.join(conv.conversationId);
    });
    
    // Écouter les nouveaux messages
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content, isEncrypted = true } = data;
        
        // Vérifier que l'utilisateur est membre de la conversation
        const participant = await prisma.participation.findUnique({
          where: {
            conversationId_userId: {
              conversationId,
              userId
            }
          }
        });
        
        if (!participant) {
          socket.emit('error', { message: 'Accès non autorisé à cette conversation' });
          return;
        }
        
        // Créer le message
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: userId,
            content,
            isEncrypted
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            }
          }
        });
        
        // Mettre à jour la date de dernière modification de la conversation
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });
        
        // Envoyer le message à tous les membres de la conversation
        io.to(conversationId).emit('new_message', message);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      }
    });
    
    // Écouter les notifications de frappe
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit('user_typing', { userId, isTyping });
    });
    
    // Gérer la déconnexion
    socket.on('disconnect', async () => {
      console.log(`Utilisateur déconnecté: ${userId}`);
      
      // Supprimer la connexion de l'utilisateur
      userSocketMap.delete(userId);
      
      // Mettre à jour le statut de l'utilisateur
      await prisma.user.update({
        where: { id: userId },
        data: { 
          status: 'offline',
          lastSeen: new Date()
        },
      });
      
      // Informer les contacts que l'utilisateur est hors ligne
      contacts.forEach(contact => {
        const contactId = contact.userId === userId ? contact.contactId : contact.userId;
        const contactSocketId = userSocketMap.get(contactId);
        
        if (contactSocketId) {
          io.to(contactSocketId).emit('user_status', { userId, status: 'offline' });
        }
      });
    });
  });

  console.log('Socket.io initialisé');
  res.end();
}
