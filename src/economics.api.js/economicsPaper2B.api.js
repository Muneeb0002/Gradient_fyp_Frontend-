import api from "../api/axios.api.js";


export const submitEconomicsPaper2 = async ({
  section,
  query,
  image,
}) => {
  const hasImage = !!image;

  if (hasImage) {
    const formData = new FormData();

    formData.append("section", section);

    if (query?.trim()) {
      formData.append("query", query);
    }

    formData.append("image", {
      uri: image,
      name: "economics.jpg",
      type: "image/jpeg",
    });

    const { data } = await api.post(
      "/economics/economics_paper_two",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  }

  const { data } = await api.post(
    "/economics/economics_paper_two",
    {
      section,
      query,
    }
  );

  return data;
};