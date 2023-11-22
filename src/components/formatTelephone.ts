function formatTelephone(number: string): string {
    const numberString = number.toString();

    const codArea = numberString.substring(0, 2);
    const part1 = numberString.substring(2, 7);
    const part2 = numberString.substring(7, 11);

    return `(${codArea}) ${part1}-${part2}`;
}

export default formatTelephone;