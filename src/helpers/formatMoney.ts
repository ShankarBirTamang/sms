export const formatMoneyToNepali = (amount: number): string => {
  if (isNaN(amount)) return "Invalid amount";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "NPR",
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace("NPR", "Rs.");
};

export const formatMoneyToNepali2 = (amount: number): string => {
  if (isNaN(amount)) return "Invalid amount";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "NPR",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("NPR", "");
};

const numberToWords = (num: number): string => {
  const belowTwenty = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const scales = ["", "Thousand", "Lakh", "Crore", "Arba"];

  if (num === 0) return "Zero";

  const toWords = (n: number): string => {
    if (n < 20) return belowTwenty[n];
    if (n < 100)
      return (
        tens[Math.floor(n / 10)] +
        (n % 10 !== 0 ? " " + belowTwenty[n % 10] : "")
      );
    if (n < 1000)
      return (
        belowTwenty[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " and " + toWords(n % 100) : "")
      );

    let word = "";
    let scaleIndex = 0;
    const parts: string[] = [];

    // Break the number into Nepali-style groups
    while (n > 0) {
      const divisor = scaleIndex === 0 ? 1000 : 100; // Use 1000 for the first group, then 100
      const part = n % divisor;
      if (part !== 0) {
        parts.push(
          toWords(part) + (scales[scaleIndex] ? " " + scales[scaleIndex] : "")
        );
      }
      n = Math.floor(n / divisor);
      scaleIndex++;
    }

    // Combine the parts in reverse order
    return parts.reverse().join(" ");
  };

  return toWords(num);
};

export const formatMoneyToNepaliWords = (amount: number): string => {
  const rupees = Math.floor(amount);
  const paisa = Math.round((amount - rupees) * 100);

  const rupeeWords = numberToWords(rupees) + " Rupees";
  const paisaWords = paisa > 0 ? " and " + numberToWords(paisa) + " Paisa" : "";

  return rupeeWords + paisaWords;
};
