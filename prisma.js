import { PrismaClient } from '@prisma/client';

// Utilisation d'une instance singleton de PrismaClient pour éviter trop de connexions
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Éviter de créer de nouvelles instances en développement
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
