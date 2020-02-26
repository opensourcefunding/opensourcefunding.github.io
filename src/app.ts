import firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseConfig } from './config';

async function bootstrap () {

    const app = firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore(app);

    const pagesSnapshot = await db.collection('pages').get();

    pagesSnapshot.forEach(page => {

        console.log(`${ page.id } => `, page.data());
    });
}


window.addEventListener('DOMContentLoaded', () => {

    bootstrap();
});
