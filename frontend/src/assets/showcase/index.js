const images = import.meta.glob("./*.{png,jpg,jpeg,svg}", { eager: true });

const formattedImages = Object.keys(images).reduce((acc, path) => {
  const imageName = path.replace("./", ""); // Remove './' to get the file name
  acc[imageName] = images[path].default;
  return acc;
}, {});

export default formattedImages;
