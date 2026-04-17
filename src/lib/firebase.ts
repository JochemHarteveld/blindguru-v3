import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBwlefSCqC2V4hk-SDNCMXYz8hUOR-M0mY',
	authDomain: 'blindguru-v3.firebaseapp.com',
	projectId: 'blindguru-v3',
	storageBucket: 'blindguru-v3.firebasestorage.app',
	messagingSenderId: '742279939923',
	appId: '1:742279939923:web:96c4688a2e6f3c553643a6'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
