function roundNumber(value: number, decimals = 0) {
    if (isNaN(value)) {
        return 0; // Return 0 if the value is not a number
    }
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

export { roundNumber };
