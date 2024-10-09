import { initializeApp } from "firebase/app";
import { doc, onSnapshot, getFirestore, collection, getDocs, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

console.log('started with webpack!');

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const facturesCollection = collection(db, 'factures');
let factures = [];

onSnapshot(collection(db, 'factures'), (snapshot) => {
  let factures = [];
  snapshot.docs.map((doc) => {
    factures.push({...doc.data(), id: doc.id});
  });
  showFactures(factures);
});

const getFactures = async () => {
    const facturesSnapshot = await getDocs(facturesCollection);
    let factures = [];
    facturesSnapshot.docs.map((doc) => {
      factures.push({...doc.data(), id: doc.id});
    });

    return factures;
}

document.querySelector("#addFacture").addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("Submit add facture");

  let number = document.querySelector('#number').value;
  let status = document.querySelector('#status').value;

  if (number !== "" && status !== "") {
    await addDoc(collection(db, "factures"), {
      'number': number,
      'status': status,
      'date': serverTimestamp()
    });

    factures = await getFactures();
    showFactures(factures);

    document.querySelector('#number').value = "";
    document.querySelector('#status').value = "";
  } else {
    alert('Merci de renseiger les champs !');
  }
});

const showFactures = (factures) => {
  document.querySelector('#listFactures').innerHTML = '';
  factures.map((facture, key) => {
    document.querySelector('#listFactures').innerHTML += '<li class="'+(facture.status == 'A payer' ? 'red' : 'green')+'">'+facture.number+' <button class="deleteFacture" data-id="'+facture.id+'">X</button></li>';
  });

  document.querySelectorAll('.deleteFacture').forEach(element => {
    element.addEventListener('click', async (e) => {
      await deleteDoc(doc(db, "factures", e.target.getAttribute('data-id')));
    });
  });
}
