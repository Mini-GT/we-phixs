export const catetogryColors = {
  "Bug Report": "bg-red-100 text-red-800",
  "Feature Request": "bg-blue-100 text-blue-800",
  Other: "bg-green-100 text-green-800",
};

export const getCategoryColor = (category: keyof typeof catetogryColors) => {
  return catetogryColors[category] || "bg-gray-100 text-gray-800";
};
