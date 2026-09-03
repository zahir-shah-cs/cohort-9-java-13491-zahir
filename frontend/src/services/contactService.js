import Api from "../Utils/Api.js";

const contactService = {

  getContacts: async (page = 0, size = 10, search = "") => {
    const response = await Api.get("/user-contacts", {
      params: {
        page,
        size,
        search,
      },
    });

    return response.data;
  },

  createContact: async (contact) => {
    const response = await Api.post("/user-contacts", contact);
    return response.data;
  },

  updateContact: async (id, contact) => {
    const response = await Api.put(`/user-contacts/${id}`, contact);
    return response.data;
  },

  deleteContact: async (id) => {
    await Api.delete(`/user-contacts/${id}`);
  },

  // EXPORT
  exportContacts: async () => {
    const response = await Api.get(
      "/user-contacts/export",
      {
        responseType: "blob",
      }
    );

    return response.data;
  },

   // IMPORT
  importContacts: async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await Api.post(
      "/user-contacts/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

};

export default contactService;