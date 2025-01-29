import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Replace with your actual Firebase configuration
const firebaseConfig = {
  // ... your Firebase configuration
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const customerList = document.getElementById('customerList');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const customerForm = document.getElementById('customerForm');
const customerDataForm = document.getElementById('customerDataForm');
const customerIdInput = document.getElementById('customerId');
const customerNameInput = document.getElementById('customerName');
const customerEmailInput = document.getElementById('customerEmail');
const customerPhoneInput = document.getElementById('customerPhone');
const customerAddressInput = document.getElementById('customerAddress');
const customerCompanyInput = document.getElementById('customerCompany');
const customerNotesInput = document.getElementById('customerNotes');
const cancelFormBtn = document.getElementById('cancelForm');

// Function to fetch and display customers
async function fetchCustomers() {
  const customersRef = collection(db, 'customers');
  const querySnapshot = await getDocs(customersRef);
  customerList.innerHTML = ''; 

  querySnapshot.forEach((doc) => {
    const customer = doc.data();
    const customerItem = document.createElement('li');
    customerItem.classList.add('customer-item');
    customerItem.innerHTML = `
      <span>${customer.name}</span> - 
      <span>${customer.email}</span>
      <button class="editBtn" data-id="${doc.id}">Edit</button>
      <button class="deleteBtn" data-id="${doc.id}">Delete</button>
    `;
    customerList.appendChild(customerItem);
  });

  // Add event listeners for edit and delete buttons
  const editBtns = document.querySelectorAll('.editBtn');
  editBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const customerId = btn.getAttribute('data-id');
      editCustomer(customerId);
    });
  });

  const deleteBtns = document.querySelectorAll('.deleteBtn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const customerId = btn.getAttribute('data-id');
      deleteCustomer(customerId);
    });
  });
}

// Function to show/hide customer form
function toggleForm() {
  customerForm.classList.toggle('hidden');
}

// Function to add a new customer
async function addCustomer() {
  try {
    const docRef = await addDoc(collection(db, 'customers'), {
      name: customerNameInput.value,
      email: customerEmailInput.value,
      phone: customerPhoneInput.value,
      address: customerAddressInput.value,
      company: customerCompanyInput.value,
      notes: customerNotesInput.value,
    });

    console.log('Document written with ID: ', docRef.id);
    clearForm();
    toggleForm();
    fetchCustomers(); 
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

// Function to edit a customer
async function editCustomer(customerId) {
  const docRef = doc(db, 'customers', customerId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const customerData = docSnap.data();
    customerIdInput.value = customerId;
    customerNameInput.value = customerData.name;
    customerEmailInput.value = customerData.email;
    customerPhoneInput.value = customerData.phone;
    customerAddressInput.value = customerData.address;
    customerCompanyInput.value = customerData.company;
    customerNotesInput.value = customerData.notes;
    toggleForm();
  } else {
    // Handle case where document does not exist
    console.log('No such document!');
  }
}

// Function to update a customer
async function updateCustomer() {
  try {
    const customerId = customerIdInput.value;
    const docRef = doc(db, 'customers', customerId);
    await updateDoc(docRef, {
      name: customerNameInput.value,
      email: customerEmailInput.value,
      phone: customerPhoneInput.value,
      address: customerAddressInput.value,
      company: customerCompanyInput.value,
      notes: customerNotesInput.value,
    });
    console.log('Document updated with ID: ', customerId);
    clearForm();
    toggleForm();
    fetchCustomers(); 
  } catch (e) {
    console.error('Error updating document: ', e);
  }
}

// Function to delete a customer
async function deleteCustomer(customerId) {
  try {
    await deleteDoc(doc(db, 'customers', customerId));
    console.log('Document deleted with ID: ', customerId);
    fetchCustomers();
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
}

// Function to clear form fields
function clearForm() {
  customerIdInput.value = '';
  customerNameInput.value = '';
  customerEmailInput.value = '';
  customerPhoneInput.value = '';
  customerAddressInput.value = '';
  customerCompanyInput.value = '';
  customerNotesInput.value = '';
}

// Event listeners
addCustomerBtn.addEventListener('click', () => {
  toggleForm();
  clearForm();
});

cancelFormBtn.addEventListener('click', toggleForm);

customerDataForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (customerIdInput.value) {
    updateCustomer();
  } else {
    addCustomer();
  }
});

// Fetch customers on page load
fetchCustomers();
