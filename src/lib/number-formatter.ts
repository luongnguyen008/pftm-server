export interface NumberFormatterOptions {
    /** Locale for formatting (default: 'ko-KR') */
    locale?: Intl.LocalesArgument;
    /** Unit/suffix to append after the number */
    unit?: string;
    /** Text/symbol to prepend before the number */
    prefix?: string;
    /** Number of decimal places (digits after the decimal point) */
    decimals?: number;
    /** Whether to use fixed decimal places (will add zeros if needed) */
    fixedDecimals?: boolean;
    /** Format as currency with the specified currency code (e.g., 'USD', 'EUR') */
    currency?: string;
    /** Format as percentage */
    isPercentage?: boolean;
    /** Use compact notation (e.g., 1K, 1M) */
    compact?: boolean;
    /** Rounding mode */
    roundingMode?: 'ceil' | 'floor' | 'round' | 'trunc';
    /** Minimum integer digits */
    minIntegerDigits?: number;
    /** Always show sign (+ for positive numbers) */
    signDisplay?: 'auto' | 'always' | 'never' | 'exceptZero';
    /** Custom notation */
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
}

export const DEFAULT_LOCALE = 'en-US';

/**
 * Format a number with various options
 * @param number The number to format
 * @param options Formatting options
 * @returns Formatted number string
 */
export const numberFormatter = (number: number, options: NumberFormatterOptions = {}): string => {
    const {
        locale = DEFAULT_LOCALE,
        unit = '',
        prefix = '',
        decimals,
        fixedDecimals = false,
        currency,
        isPercentage = false,
        compact = false,
        roundingMode,
        minIntegerDigits,
        signDisplay,
        notation = compact ? 'compact' : 'standard',
    } = options;

    // Handle special cases
    if (!Number.isFinite(number)) {
        return `${prefix}${String(number)}${unit}`;
    }

    // Apply rounding if specified
    let processedNumber = number;
    if (typeof decimals === 'number' && roundingMode) {
        const factor = 10 ** decimals;
        switch (roundingMode) {
            case 'ceil':
                processedNumber = Math.ceil(number * factor) / factor;
                break;
            case 'floor':
                processedNumber = Math.floor(number * factor) / factor;
                break;
            case 'round':
                processedNumber = Math.round(number * factor) / factor;
                break;
            case 'trunc':
                processedNumber = Math.trunc(number * factor) / factor;
                break;
        }
    }

    // Configure number format options
    const formatOptions: Intl.NumberFormatOptions = {
        notation,
    };

    if (typeof minIntegerDigits === 'number') {
        formatOptions.minimumIntegerDigits = minIntegerDigits;
    }

    if (typeof decimals === 'number') {
        formatOptions.minimumFractionDigits = fixedDecimals ? decimals : 0;
        formatOptions.maximumFractionDigits = decimals;
    }

    if (signDisplay) {
        formatOptions.signDisplay = signDisplay;
    }

    // Set style based on format type
    if (currency) {
        formatOptions.style = 'currency';
        formatOptions.currency = currency;
    } else if (isPercentage) {
        formatOptions.style = 'percent';
    } else {
        formatOptions.style = 'decimal';
    }

    // Format the number
    const formattedNumber = new Intl.NumberFormat(locale, formatOptions).format(processedNumber);

    // Add prefix/suffix if not using currency (which has its own symbol)
    if (currency) {
        return `${prefix}${formattedNumber}${unit}`;
    } else {
        return `${prefix}${formattedNumber}${unit}`;
    }
};

/**
 * Format a number as currency
 * @param number The number to format
 * @param option Formatting options
 * @property option.currency Currency code (e.g., 'USD', 'EUR')
 * @property option.locale Locale for formatting
 * @returns Formatted currency string
 */
export const currencyFormatter = (
    number: number,
    option?: Pick<NumberFormatterOptions, 'currency' | 'locale' | 'signDisplay' | 'fixedDecimals' | 'decimals'>
) => {
    return numberFormatter(number, {
        locale: DEFAULT_LOCALE,
        fixedDecimals: true,
        ...option,
    });
};

/**
 * Format a number as percentage
 * @param number The number to format
 * @param option Formatting options
 * @property option.isPercentage Whether to format as percentage
 * @property option.decimals Number of decimal places
 * @property option.locale Locale for formatting
 * @property option.signDisplay Whether to show the sign
 * @returns Formatted percentage string
 */
export const percentFormatter = (
    number: number,
    option?: Pick<NumberFormatterOptions, 'decimals' | 'locale' | 'signDisplay' | 'fixedDecimals'>
) => {
    return numberFormatter(number / 100, {
        decimals: 0,
        locale: 'en-US',
        isPercentage: true,
        fixedDecimals: true,
        ...option,
    });
};

/**
 * Format a number in compact notation (e.g., 1K, 1M)
 * @param number The number to format
 * @param option Formatting options
 * @property option.decimals Number of decimal places
 * @property option.locale Locale for formatting
 * @returns Formatted compact number string
 */
export const compactFormatter = (
    number: number,
    option?: Pick<NumberFormatterOptions, 'decimals' | 'locale' | 'signDisplay' | 'fixedDecimals'>
) => {
    const absNumber = Math.abs(number);
    if (absNumber < 1000) {
        return numberFormatter(number, {
            decimals: 1,
            locale: 'en-US',
            compact: true,
            ...option,
            fixedDecimals: false,
        });
    }

    // For numbers >= 1 trillion, format as billions to cap at "B"
    if (absNumber >= 1_000_000_000_000) {
        const billionValue = number / 1_000_000_000;
        return numberFormatter(billionValue, {
            decimals: option?.decimals ?? 0,
            locale: option?.locale ?? 'en-US',
            fixedDecimals: option?.fixedDecimals,
            unit: 'B',
        });
    }

    return numberFormatter(number, {
        decimals: 1,
        fixedDecimals: true,
        locale: 'en-US',
        compact: true,
        ...option,
    });
};

/**
 * Rounds a value to the nearest multiple of the price step
 *
 * @param value - The original value to round
 * @param numberStep - The number step to round to (e.g., 100)
 * @returns The rounded value
 */
export const roundToNumberStep = (value: number, numberStep: number): number => {
    // Calculate how many steps the value represents
    const steps = value / numberStep;

    // Round to the nearest step
    const roundedSteps = Math.round(steps);

    // Convert back to the actual value
    const roundedValue = roundedSteps * numberStep;

    // Ensure we return a properly formatted number without floating point issues
    return Number(roundedValue.toFixed(2));
};

/**
 * Format a number with commas
 * @param value The number to format
 * @returns Formatted number string with commas
 */
export const formatNumberWithCommas = (value: string | number) => {
    if (typeof value === 'number') {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Convert a currency string to a number
 * @param value The currency string to convert
 * @returns Converted number
 */
export const convertCurrencyToNumber = (value: string) => {
    return value.replace(/[^\d]/g, '');
};

export const hasMoreThan2Decimals = (num: number) => {
    const parts = num.toString().split('.');
    return parts[1] && parts[1].length > 2;
};
