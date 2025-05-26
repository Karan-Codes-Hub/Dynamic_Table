
const GenericUtil = {
  /***
   *
   * @param str1
   * @param str2
   * @param ignoreCase
   *
   * cases -
   * 1. if both thee string are empty (""), it returns true
   * 2. if any of the string is null or undefined, it returns false
   *
   */



  isNotEmpty(strOrArray: any): boolean {
    return !this.isEmpty(strOrArray);
  },

  doesPatternMatch(pattern: RegExp | string | any, value: any): boolean {
    return new RegExp(pattern).test(value);
  },

  isValidId(id: any): boolean {
    const numericId = Number(id);

    return !isNaN(numericId) && numericId > 0;
  },




  convertToString(value: any): string {
    if (typeof value === "boolean" || typeof value === "number" || value) {
      return value.toString();
    }

    return "";
  },

  splitString(str: string, regex: string | RegExp): string[] {
    if (!str) {
      return [];
    }
    const splitValues: string[] = str.split(regex);

    return splitValues.map((item) => item.trim()).filter((item) => !!item);
  },

  convertToNumber(value: any, defaultValue: number = 0): number {
    const convertedNumber = Number(value);

    if (isNaN(convertedNumber)) {
      return defaultValue;
    }

    return convertedNumber;
  },



  formatNumberForCurrency(
    number: any,
    maximumFractionDigits: number = 2,
    locale: string = "en-IN"
  ): string {
    const sanitizedNumber = this.sanitizeToNumber(number);
    if (!sanitizedNumber) {
      return "";
    }

    const isDotPresent: boolean = sanitizedNumber.includes(".");
    let digitsAfterDot = "";
    if (isDotPresent) {
      digitsAfterDot = this.trimToLengthFromStart(sanitizedNumber.split(".")[1] ?? "", maximumFractionDigits);
    }

    let convertedNumber = new Intl.NumberFormat(locale, {
      style: "decimal",
      maximumFractionDigits: maximumFractionDigits,
    }).format(Number(number));

    if (!convertedNumber) {
      return "";
    }

    if (convertedNumber.includes(".") || !isDotPresent) {
      return convertedNumber;
    }
    return  convertedNumber + "." + digitsAfterDot;
  },



  evaluateMathExpression(expression: any, valueDataMap: any): number {
    if (!expression || !valueDataMap) {
      return 0;
    }

    const expressionString = this.convertToString(expression);
    const expressionToSplit = expressionString.replace(
      new RegExp("[\\(\\)\\[\\]]", "g"),
      ""
    );
    let splitExpression = this.splitString(expressionToSplit, /\s[+\-*/]\s/);

    if (this.isEmpty(splitExpression)) {
      return 0;
    }

    const expressionKeys = splitExpression.sort((a, b) => b.length - a.length);

    let result: number = 0;
    try {
      let replacedExpression = expressionString;
      expressionKeys.forEach((expressionKey) => {
        const value = valueDataMap[expressionKey] || "0";
        replacedExpression = replacedExpression.replace(
          new RegExp(expressionKey, "g"),
          value
        );
      });

      result = new Function("return " + replacedExpression)();
    } catch (e) {
      result = 0;
    }

    return result;
  },

  formatNumberToCurrencyWithoutSymbol(num: string ): string {
    if (!num) return "";

    num = num.replace(/^0+(?!$)/, "");

    const lastThree = num.slice(-3);
    const otherDigits = num.slice(0, -3);

    const formatted =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherDigits ? "," : "") +
      lastThree;

    return formatted;
  },



  formatNumberToCurrencyConverterInWords(number: any): string {
    const numString = this.convertToString(number);
    if (!numString || !numString.trim()) {
      return "";
    }

    let sanitizedNumber = this.sanitizeToNumber(numString);
    if (!sanitizedNumber) {
      return "0.00";
    }

    // Convert to number if it's a string
    let num = this.convertToNumber(sanitizedNumber);

    // Handle zero case
    if (num === 0) {
      return '0.00';
    }

    let isNegative = false;
    if (num < 0) {
      isNegative = true;
      num = Math.abs(num);
    }

    let formattedNumber: string;
    let unit = "";

    if (num >= 10000000) { // 1 Crore or more
      const value = num / 10000000;
      formattedNumber = value.toFixed(2);
      unit = "Cr";
    } else if (num >= 100000) { // 1 Lakh or more
      const value = num / 100000;
      formattedNumber = value.toFixed(2);
      unit = "Lakh";
    } else { // Less than 1 Lakh
      formattedNumber = num.toFixed(2);
    }

    // Split into whole and decimal parts to properly add commas
    const parts = formattedNumber.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formattedNumber = parts.join('.');

    if (isNegative) {
      return `-${formattedNumber} ${unit}`.trim();
    }

    return `${formattedNumber} ${unit}`.trim();
  },



  sanitizeToNumber(input: any): string | null {
    input = this.convertToString(input);
    if (!input || !input.trim()) {
      return null;
    }

    input = input.trim();

    const isNegative = input.startsWith('-');

    // 2. Keep only digits and dots
    const digitsAndDots = input.replace(/[^0-9.]/g, '');

    // 3. Keep only the first dot
    let dotSeen = false;
    let numericStr = '';
    for (const ch of digitsAndDots) {
      if (ch === '.') {
        if (!dotSeen) {
          numericStr += '.';
          dotSeen = true;
        }
      } else {
        numericStr += ch;
      }
    }

    // 4. Split into integer and decimal part
    const [intPartRaw, decimalPart = ''] = numericStr.split('.');

    // 5. Clean integer part
    const intPart = intPartRaw.replace(/^0+(?=\d)/, '') || '0';

    // 6. Combine
    return (isNegative ? '-' : '') + intPart + (dotSeen ? '.' + decimalPart : '');
  },

  getNumberInWords(num: any): string {
    num = this.sanitizeToNumber(num);
    if (!num) {
      return "";
    }

    if (this.convertToNumber(num) === 0) {
      return "Zero";
    }
    const isNegative = num.startsWith("-");
    if (isNegative) {
      num = num.replace("-", "");
    }
    const bd = parseFloat(num);
    let number = Math.floor(bd);
    let no = Math.floor(bd);
    const decimal = Math.round((bd % 1) * 100);
    let decimalString = num.split(".")[1] || "";
    const digitsLength = no.toString().length;
    let i = 0;
    const str: string[] = [];

    const words = new Map<number, string>([
      [0, ""], [1, "One"], [2, "Two"], [3, "Three"], [4, "Four"],
      [5, "Five"], [6, "Six"], [7, "Seven"], [8, "Eight"], [9, "Nine"],
      [10, "Ten"], [11, "Eleven"], [12, "Twelve"], [13, "Thirteen"],
      [14, "Fourteen"], [15, "Fifteen"], [16, "Sixteen"], [17, "Seventeen"],
      [18, "Eighteen"], [19, "Nineteen"], [20, "Twenty"], [30, "Thirty"],
      [40, "Forty"], [50, "Fifty"], [60, "Sixty"], [70, "Seventy"],
      [80, "Eighty"], [90, "Ninety"]
    ]);

    const digits = ["", "Hundred", "Thousand", "Lakh", "Crore", "Billion"];

    while (i < digitsLength) {
      const divider = (i === 2) ? 10 : 100;
      number = no % divider;
      no = Math.floor(no / divider);
      i += (divider === 10) ? 1 : 2;

      if (number > 0) {
        const counter = str.length;
        const plural = (counter > 0 && number > 9) ? "s" : "";
        const tmp = (number < 21)
          ? `${words.get(number)} ${digits[counter]}${plural}`
          : `${words.get(Math.floor(number / 10) * 10)} ${words.get(number % 10)} ${digits[counter]}${plural}`;
        str.push(tmp.trim());
      } else {
        str.push("");
      }
    }

    str.reverse();
    const wholeNumberWord = str.filter(part => part).join(" ").trim();

    let decimalWord = "";
    if (this.convertToNumber(decimalString) > 0) {

      for (let i = 0; i < decimalString.length; i++) {
        const numAtChar = this.convertToNumber(decimalString.charAt(i));
        if (numAtChar === 0) {
          decimalWord = this.join(" ", decimalWord, "Zero");
        } else {
          decimalWord = this.join(" ", decimalWord, words.get(numAtChar));
        }
      }

      decimalWord = this.join(" ", " Point", decimalWord)
    }

    return `${isNegative ? "Minus " : ""}${wholeNumberWord}${decimalWord}`.replace(/\s{2,}/g, ' ').trim();
  },

  getAmountInIndianCurrency(num: any): string {
    num = this.sanitizeToNumber(num);
    if (!num) {
      return "";
    }
    const bd = parseFloat(num);
    let number = Math.floor(bd);
    let no = Math.floor(bd);
    const decimal = Math.round((bd % 1) * 100);
    const digitsLength = no.toString().length;
    let i = 0;
    const str: string[] = [];

    const words = new Map<number, string>([
      [0, ""], [1, "One"], [2, "Two"], [3, "Three"], [4, "Four"],
      [5, "Five"], [6, "Six"], [7, "Seven"], [8, "Eight"], [9, "Nine"],
      [10, "Ten"], [11, "Eleven"], [12, "Twelve"], [13, "Thirteen"],
      [14, "Fourteen"], [15, "Fifteen"], [16, "Sixteen"], [17, "Seventeen"],
      [18, "Eighteen"], [19, "Nineteen"], [20, "Twenty"], [30, "Thirty"],
      [40, "Forty"], [50, "Fifty"], [60, "Sixty"], [70, "Seventy"],
      [80, "Eighty"], [90, "Ninety"]
    ]);

    const digits = ["", "Hundred", "Thousand", "Lakh", "Crore", "Billion"];

    while (i < digitsLength) {
      const divider = (i === 2) ? 10 : 100;
      number = no % divider;
      no = Math.floor(no / divider);
      i += (divider === 10) ? 1 : 2;

      if (number > 0) {
        const counter = str.length;
        const plural = (counter > 0 && number > 9) ? "s" : "";
        const tmp = (number < 21)
          ? `${words.get(number)} ${digits[counter]}${plural}`
          : `${words.get(Math.floor(number / 10) * 10)} ${words.get(number % 10)} ${digits[counter]}${plural}`;
        str.push(tmp.trim());
      } else {
        str.push("");
      }
    }

    str.reverse();
    const rupees = str.filter(part => part).join(" ").trim();

    const paise = (decimal > 0)
      ? ` And Paise ${words.get(Math.floor(decimal / 10) * 10)} ${words.get(decimal % 10)}`
      : "";

    return `${rupees}${paise}`.replace(/\s{2,}/g, ' ').trim();
  },

  toInteger(val: any): number | null {
    const parsed = parseInt(this.sanitizeToNumber(val), 10);
    return isNaN(parsed) ? null : parsed;
  }
}


export default GenericUtil;