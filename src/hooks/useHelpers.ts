const useHelpers = () => {
  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to read file as base64."));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file."));
      };
      reader.readAsDataURL(file);
    });
  };
  return {
    capitalizeFirstLetter,
    convertFileToBase64,
  };
};

export default useHelpers;
