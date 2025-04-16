// src/utils/encryption.js

const ENCRYPTION_KEY_NAME = 'document_encryption_key';

// Generate a new encryption key or retrieve existing one from localStorage
export async function getOrCreateEncryptionKey() {
  // Check if we already have a key in localStorage
  const storedKey = localStorage.getItem(ENCRYPTION_KEY_NAME);
  
  if (storedKey) {
    // Convert the stored key back to a CryptoKey object
    const keyData = JSON.parse(storedKey);
    return await window.crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  } else {
    // Generate a new key
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    // Export the key to store it
    const exportedKey = await window.crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(exportedKey));
    
    return key;
  }
}

// Encrypt text using AES-GCM
export async function encrypt(text) {
  if (!text) return text;
  
  try {
    const key = await getOrCreateEncryptionKey();
    
    // Create an initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Convert the text to an ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Combine the IV and encrypted data and convert to Base64
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(result)]));
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Fallback to unencrypted text
  }
}

// Decrypt text using AES-GCM
export async function decrypt(encryptedText) {
  if (!encryptedText) return encryptedText;
  
  try {
    const key = await getOrCreateEncryptionKey();
    
    // Convert the Base64 string back to an array
    const binaryString = atob(encryptedText);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Extract the IV (first 12 bytes)
    const iv = bytes.slice(0, 12);
    
    // Extract the actual encrypted data (everything after the IV)
    const data = bytes.slice(12);
    
    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    // Convert the decrypted data back to text
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Return the encrypted text if decryption fails
  }
}
