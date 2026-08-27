import api from "../Utils/Api.js";

const createContact = async (contactData) => {
  const response = await api.post("/contacts", contactData);

  return response.data;
};

const getContacts = async () => {
  const response = await api.get("/contacts");

  return response.data;
};

const getContactById = async (id) => {
  const response = await api.get(`/contacts/${id}`);

  return response.data;
};

const updateContact = async (id, contactData) => {
  const response = await api.put(`/contacts/${id}`, contactData);

  return response.data;
};

const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);

  return response.data;
};

export default {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};