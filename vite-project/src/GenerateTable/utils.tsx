export const formatDate = (dateArray: string | Date | null): string | null => {
    if (dateArray === null || dateArray === '') {
        return null;
    }
    const dateObject = new Date(dateArray);
    const year = dateObject?.getUTCFullYear();
    const month = String(dateObject?.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObject?.getUTCDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}

export const formatNumberForCurrency = (number: number | null | undefined): string => {
    if (number === null || number === undefined || isNaN(number)) return '';

    // Get the user's locale or fallback to Indian format as default
    // const localeToUse = `${process.env.NEXT_PUBLIC_LOCALE}` ;
    const localeToUse = 'en-IN';

    return new Intl.NumberFormat(localeToUse, {
      style: "decimal",
      maximumFractionDigits: 2,
    }).format(number);
};

