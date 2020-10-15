export function between(a, b, c) {
    let isBetween = false;
    if ((a >= b) && (a <= c)) {
        isBetween = true;
    }
    return isBetween;
}