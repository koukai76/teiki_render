// https://qiita.com/mogmet/items/23d4ee734f4b193b8106

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const getFirebaseApp = (): FirebaseApp => {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }
  return initializeApp(config);
};

const DB_NAME = 'DB';
const config = JSON.parse(process.env.FIREBASE);

const firebaseApp = getFirebaseApp();
const db = getFirestore(firebaseApp);
const coll = collection(db, DB_NAME);

export const read = async (id: string): Promise<{ href: string }[]> => {
  return new Promise(resolve => {
    getDoc(doc(coll, id))
      .then(snapshot => {
        resolve(JSON.parse(snapshot.data().data));
      })
      .catch(error => {
        resolve([]);
      });
  });
};

export const update = async (id: string, data: any) => {
  return new Promise((resolve, reject) => {
    setDoc(doc(coll, id), {
      data: JSON.stringify(data),
    })
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const del = async (id: string) => {
  return new Promise((resolve, reject) => {
    deleteDoc(doc(coll, id))
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        reject(error);
      });
  });
};
