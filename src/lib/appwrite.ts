import { Client, Account, Databases, Storage, ID } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
    console.error('Appwrite environment variables are missing. Please check your .env file.');
}

export const client = new Client()
    .setEndpoint(endpoint || '')
    .setProject(projectId || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database/Collection Constants - Replace these with your actual IDs from Appwrite Console
export const DB_ID = 'main'; 
export const ROOMS_COLLECTION = 'rooms';
export const RECORDINGS_BUCKET = 'recordings';

export { ID };
