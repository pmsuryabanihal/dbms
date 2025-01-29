import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "dbmspmsurya.firebaseapp.com",
  projectId: "dbmspmsurya",
  storageBucket: "dbmspmsurya.firebasestorage.app",
  messagingSenderId: "889452567773",
  appId: "1:889452567773:web:47890dcf925a8421018f34",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// LOGIN FUNCTION
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});

// LOGOUT FUNCTION
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// CUSTOMER FORM TOGGLE
document.getElementById("addCustomerBtn")?.addEventListener("click", () => document.getElementById("customerForm").classList.toggle("hidden"));
document.getElementById("cancelForm")?.addEventListener("click", () => document.getElementById("customerForm").classList.add("hidden"));

// ADD OR EDIT CUSTOMER
document.getElementById("customerDataForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("customerId").value;
  const name = document.getElementById("customerName").value;
  const email = document.getElementById("customerEmail").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;

  if (id) {
    await updateDoc(doc(db, "customers", id), { name, email, phone, address });
  } else {
    await addDoc(collection(db, "customers"), { name, email, phone, address });
  }

  alert("Customer Saved!");
  location.reload();
});

// FETCH CUSTOMERS
async function loadCustomers() {
  const customerList = document.getElementById("customerList");
  const querySnapshot = await getDocs(collection(db, "customers"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `${data.name} - ${data.email} - ${data.phone} 
                    <button onclick="editCustomer('${doc.id}', '${data.name}', '${data.email}', '${data.phone}', '${data.address}')">Edit</button>
                    <button onclick="deleteCustomer('${doc.id}')">Delete</button>`;
    customerList.appendChild(li);
  });
}

// EDIT CUSTOMER
window.editCustomer = function (id, name, email, phone, address) {
  document.getElementById("customerId").value = id;
  document.getElementById("customerName").value = name;
  document.getElementById("customerEmail").value = email;
  document.getElementById("customerPhone").value = phone;
  document.getElementById("customerAddress").value = address;
  document.getElementById("customerForm").classList.remove("hidden");
};

// DELETE CUSTOMER
window.deleteCustomer = async function (id) {
  if (confirm("Are you sure?")) {
    await deleteDoc(doc(db, "customers", id));
    location.reload();
  }
};

loadCustomers();
