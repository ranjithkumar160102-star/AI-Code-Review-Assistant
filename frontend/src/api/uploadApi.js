import api from "./api";

/**
 * Upload Source Code File
 */
export const uploadFile = async (formData) => {
  const response = await api.post(
    "/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};