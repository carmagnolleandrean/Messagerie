import CryptoJS from 'crypto-js';

// Fonction pour générer une clé de chiffrement unique pour une conversation
export function generateEncryptionKey() {
  return CryptoJS.lib.WordArray.random(256 / 8).toString();
}

// Fonction pour chiffrer un message
export function encryptMessage(message, encryptionKey) {
  if (!message || !encryptionKey) {
    throw new Error('Le message et la clé de chiffrement sont requis');
  }
  
  try {
    return CryptoJS.AES.encrypt(message, encryptionKey).toString();
  } catch (error) {
    console.error('Erreur lors du chiffrement du message:', error);
    throw new Error('Échec du chiffrement du message');
  }
}

// Fonction pour déchiffrer un message
export function decryptMessage(encryptedMessage, encryptionKey) {
  if (!encryptedMessage || !encryptionKey) {
    throw new Error('Le message chiffré et la clé de chiffrement sont requis');
  }
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Erreur lors du déchiffrement du message:', error);
    throw new Error('Échec du déchiffrement du message');
  }
}

// Fonction pour hacher une chaîne (par exemple, pour les mots de passe)
export function hashString(str) {
  if (!str) {
    throw new Error('La chaîne à hacher est requise');
  }
  
  try {
    return CryptoJS.SHA256(str).toString();
  } catch (error) {
    console.error('Erreur lors du hachage de la chaîne:', error);
    throw new Error('Échec du hachage de la chaîne');
  }
}

// Fonction pour générer un sel aléatoire
export function generateSalt() {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

// Fonction pour hacher un mot de passe avec un sel
export function hashPassword(password, salt) {
  if (!password) {
    throw new Error('Le mot de passe est requis');
  }
  
  const saltToUse = salt || generateSalt();
  
  try {
    const hash = CryptoJS.PBKDF2(password, saltToUse, {
      keySize: 512 / 32,
      iterations: 1000
    }).toString();
    
    return {
      hash,
      salt: saltToUse
    };
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe:', error);
    throw new Error('Échec du hachage du mot de passe');
  }
}

// Fonction pour vérifier un mot de passe
export function verifyPassword(password, hash, salt) {
  if (!password || !hash || !salt) {
    throw new Error('Le mot de passe, le hash et le sel sont requis');
  }
  
  try {
    const hashVerify = CryptoJS.PBKDF2(password, salt, {
      keySize: 512 / 32,
      iterations: 1000
    }).toString();
    
    return hashVerify === hash;
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    throw new Error('Échec de la vérification du mot de passe');
  }
}
