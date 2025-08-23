import { collection, getFirestore } from 'firebase/firestore'
import { app } from './firebaseInit'

export const db = getFirestore(app)

export const usersRef = collection(db, "Users")
export const sitesRef = collection(db, "Sites")