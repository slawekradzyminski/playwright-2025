const parsePrice = (value: string): number => Number.parseFloat(value.replace('$', ''));

export const arePricesSortedDescending = (priceTexts: string[]): boolean => {
  const prices = priceTexts.map(parsePrice);

  return prices.every((price, index) => index === 0 || prices[index - 1] >= price);
};
