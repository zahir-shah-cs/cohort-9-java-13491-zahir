import Api from "../Utils/Api.js";

const profileService = {
  getProfile: async () => {
    const response = await Api.get("/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await Api.put("/profile", profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await Api.put(
      "/profile/change-password",
      passwordData
    );

    return response.data;
  },
};

export default profileService;