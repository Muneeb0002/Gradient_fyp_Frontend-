import api from "../api/axios.api.js";

/**
 * Mutation Function to handle multiple image uploads
 * @param {Object} data - Contains { section, imageUris }
 */
export const submitEconomicsPaper = async ({ section, imageUris }) => {
  const formData = new FormData();
  formData.append("section", section);

  if (Array.isArray(imageUris) && imageUris.length > 0) {
    imageUris.forEach((uri) => {
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // Postman ki tarah har image ko "Image" key ke sath append karenge
      formData.append("Image", {
        uri: uri,
        name: filename,
        type: type,
      });
    });
  }

  const response = await api.post("/economics/economics_paper_two", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // Backend response
};