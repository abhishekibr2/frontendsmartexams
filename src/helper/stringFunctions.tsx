import { Tooltip } from 'antd';

/**
 * Capitalizes the first letter of a given string.
 * @param str - The input string to capitalize.
 * @returns The capitalized string or an empty string if input is invalid.
 */
function capitalizeString(str: string | undefined): string {
    if (typeof str !== 'string' || !str.trim()) {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified number of words and wraps it in a Tooltip.
 * @param description - The input string to truncate.
 * @param maxLength - Maximum number of words allowed before truncation.
 * @returns JSX containing the truncated string with a Tooltip for full text.
 */
function truncateLongString(description: string, maxLength: number): any | string {
    if (!description) return '';

    const plainText = description.replace(/<[^>]+>/g, '');
    const words = plainText.split(' ');

    if (words.length <= maxLength) {
        return description;
    }

    const truncatedWords = words.slice(0, maxLength);
    const truncatedDescription = truncatedWords.join(' ') + '...';

    return (
        <Tooltip title={plainText}>
            <span>{truncatedDescription}</span>
        </Tooltip>
    );
}

export { capitalizeString, truncateLongString };
