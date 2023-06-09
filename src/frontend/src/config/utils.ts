export const formatCurrency = (number: number) => {
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number);
};