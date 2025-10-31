import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import {
	PUBLIC_apiKey,
	PUBLIC_appId,
	PUBLIC_authDomain,
	PUBLIC_databaseURL,
	PUBLIC_measurementId,
	PUBLIC_messagingSenderId,
	PUBLIC_projectId,
	PUBLIC_storageBucket
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_apiKey,
	authDomain: PUBLIC_authDomain,
	databaseURL: PUBLIC_databaseURL,
	projectId: PUBLIC_projectId,
	storageBucket: PUBLIC_storageBucket,
	messagingSenderId: PUBLIC_messagingSenderId,
	appId: PUBLIC_appId,
	measurementId: PUBLIC_measurementId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = 'ru';
export const db = getDatabase(app);
export const storage = getStorage(app);
