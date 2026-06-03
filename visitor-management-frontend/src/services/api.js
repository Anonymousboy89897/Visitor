import axios from 'axios';

const api = axios.create({
  baseURL: 'https://script.google.com/macros/s/AKfycbzJnb5479droeVA_qkIiD7lV0sxbjjAyDUpKOioTKSMIXmj9PI0hBeoDnLTuq8AAUjcZg/exec'
});

export default api;
