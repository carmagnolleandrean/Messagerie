import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { encryptMessage, decryptMessage } from '../src/lib/encryption';

// Initialiser le client Prisma pour les tests
const prisma = new PrismaClient();

describe('Tests des fonctionnalités de base', () => {
  // Données de test
  const testUser1 = {
    username: 'testuser1',
    email: 'test1@example.com',
    password: 'Password123!',
  };
  
  const testUser2 = {
    username: 'testuser2',
    email: 'test2@example.com',
    password: 'Password123!',
  };
  
  // Nettoyer la base de données avant tous les tests
  beforeAll(async () => {
    await prisma.message.deleteMany();
    await prisma.participation.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });
  
  // Nettoyer la base de données après tous les tests
  afterAll(async () => {
    await prisma.message.deleteMany();
    await prisma.participation.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
  
  // Tests d'authentification
  describe('Authentification', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const passwordHash = await bcrypt.hash(testUser1.password, 10);
      
      const user = await prisma.user.create({
        data: {
          username: testUser1.username,
          email: testUser1.email,
          passwordHash,
        },
      });
      
      expect(user).toBeDefined();
      expect(user.username).toBe(testUser1.username);
      expect(user.email).toBe(testUser1.email);
    });
    
    it('devrait vérifier le mot de passe correctement', async () => {
      const user = await prisma.user.findUnique({
        where: { email: testUser1.email },
      });
      
      const isPasswordValid = await bcrypt.compare(
        testUser1.password,
        user.passwordHash
      );
      
      expect(isPasswordValid).toBe(true);
    });
  });
  
  // Tests de gestion des contacts
  describe('Gestion des contacts', () => {
    let user1Id, user2Id;
    
    beforeEach(async () => {
      // Récupérer le premier utilisateur
      const user1 = await prisma.user.findUnique({
        where: { email: testUser1.email },
      });
      
      // Vérifier si le deuxième utilisateur existe déjà
      let user2 = await prisma.user.findUnique({
        where: { email: testUser2.email },
      });
      
      // Créer le deuxième utilisateur s'il n'existe pas
      if (!user2) {
        const passwordHash = await bcrypt.hash(testUser2.password, 10);
        
        user2 = await prisma.user.create({
          data: {
            username: testUser2.username,
            email: testUser2.email,
            passwordHash,
          },
        });
      }
      
      user1Id = user1.id;
      user2Id = user2.id;
    });
    
    it('devrait ajouter un contact', async () => {
      // Vérifier si le contact existe déjà
      const existingContact = await prisma.contact.findUnique({
        where: {
          userId_contactId: {
            userId: user1Id,
            contactId: user2Id,
          },
        },
      });
      
      let contact;
      
      if (existingContact) {
        contact = existingContact;
      } else {
        contact = await prisma.contact.create({
          data: {
            userId: user1Id,
            contactId: user2Id,
            status: 'pending',
          },
        });
      }
      
      expect(contact).toBeDefined();
      expect(contact.userId).toBe(user1Id);
      expect(contact.contactId).toBe(user2Id);
    });
    
    it('devrait accepter une demande de contact', async () => {
      // Vérifier si le contact existe
      let contact = await prisma.contact.findUnique({
        where: {
          userId_contactId: {
            userId: user1Id,
            contactId: user2Id,
          },
        },
      });
      
      // Créer le contact s'il n'existe pas
      if (!contact) {
        contact = await prisma.contact.create({
          data: {
            userId: user1Id,
            contactId: user2Id,
            status: 'pending',
          },
        });
      }
      
      // Mettre à jour le statut du contact
      const updatedContact = await prisma.contact.update({
        where: {
          userId_contactId: {
            userId: user1Id,
            contactId: user2Id,
          },
        },
        data: {
          status: 'accepted',
        },
      });
      
      expect(updatedContact).toBeDefined();
      expect(updatedContact.status).toBe('accepted');
    });
  });
  
  // Tests de messagerie
  describe('Messagerie', () => {
    let user1Id, user2Id, conversationId;
    const encryptionKey = 'test-encryption-key-123';
    
    beforeEach(async () => {
      const user1 = await prisma.user.findUnique({
        where: { email: testUser1.email },
      });
      
      const user2 = await prisma.user.findUnique({
        where: { email: testUser2.email },
      });
      
      user1Id = user1.id;
      user2Id = user2.id;
      
      // Vérifier si une conversation existe déjà entre les deux utilisateurs
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          participants: {
            every: {
              userId: {
                in: [user1Id, user2Id]
              }
            }
          },
          AND: [
            {
              participants: {
                some: {
                  userId: user1Id
                }
              }
            },
            {
              participants: {
                some: {
                  userId: user2Id
                }
              }
            }
          ]
        }
      });
      
      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        // Créer une conversation entre les deux utilisateurs
        const conversation = await prisma.conversation.create({
          data: {
            isGroup: false,
            participants: {
              create: [
                { userId: user1Id },
                { userId: user2Id },
              ],
            },
          },
        });
        
        conversationId = conversation.id;
      }
    });
    
    it('devrait envoyer un message', async () => {
      const messageContent = 'Bonjour, ceci est un message de test';
      const encryptedContent = encryptMessage(messageContent, encryptionKey);
      
      // Vérifier si un message existe déjà
      const existingMessage = await prisma.message.findFirst({
        where: {
          conversationId,
          senderId: user1Id,
        },
      });
      
      let message;
      
      if (existingMessage) {
        message = existingMessage;
      } else {
        message = await prisma.message.create({
          data: {
            conversationId,
            senderId: user1Id,
            content: encryptedContent,
            isEncrypted: true,
          },
        });
      }
      
      expect(message).toBeDefined();
      expect(message.conversationId).toBe(conversationId);
      expect(message.senderId).toBe(user1Id);
      expect(message.isEncrypted).toBe(true);
    });
    
    it('devrait récupérer et déchiffrer un message', async () => {
      // S'assurer qu'un message existe
      const messageContent = 'Bonjour, ceci est un message de test';
      const encryptedContent = encryptMessage(messageContent, encryptionKey);
      
      let message = await prisma.message.findFirst({
        where: {
          conversationId,
          senderId: user1Id,
        },
      });
      
      if (!message) {
        message = await prisma.message.create({
          data: {
            conversationId,
            senderId: user1Id,
            content: encryptedContent,
            isEncrypted: true,
          },
        });
      }
      
      expect(message).toBeDefined();
      
      const decryptedContent = decryptMessage(message.content, encryptionKey);
      expect(decryptedContent).toBe('Bonjour, ceci est un message de test');
    });
  });
  
  // Tests de sécurité
  describe('Sécurité', () => {
    it('devrait chiffrer et déchiffrer correctement un message', () => {
      const originalMessage = 'Message secret à chiffrer';
      const encryptionKey = 'clé-de-chiffrement-123';
      
      const encryptedMessage = encryptMessage(originalMessage, encryptionKey);
      expect(encryptedMessage).not.toBe(originalMessage);
      
      const decryptedMessage = decryptMessage(encryptedMessage, encryptionKey);
      expect(decryptedMessage).toBe(originalMessage);
    });
    
    it('devrait échouer avec une clé de déchiffrement incorrecte', () => {
      const originalMessage = 'Message secret à chiffrer';
      const encryptionKey = 'clé-de-chiffrement-123';
      const wrongKey = 'mauvaise-clé-456';
      
      const encryptedMessage = encryptMessage(originalMessage, encryptionKey);
      
      // Utiliser une fonction qui vérifie si le résultat est différent
      const decryptedWithWrongKey = decryptMessage(encryptedMessage, wrongKey);
      expect(decryptedWithWrongKey).not.toBe(originalMessage);
    });
  });
});
