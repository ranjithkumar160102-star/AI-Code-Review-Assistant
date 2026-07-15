import api from "./api";

export const uploadFile = async (file) => {
  const formData = new FormData();

  // Must match upload.single("codeFile")
  formData.append("codeFile", file);

  const response = await api.post("/upload", formData);

  return response.data;
};