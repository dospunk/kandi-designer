/**
 * Adds two points together
 * @param a
 * @param b
 * @returns the sum of `a` and `b`
 */
export function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}
/**
 * Subtracts `b` from `a`
 * @param a
 * @param b
 * @returns the difference of `a` and `b`
 */
export function sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
}
/**
 * Multiplies `a` and `b`
 * @param a
 * @param b
 * @returns the product of `a` and `b`
 */
export function mult(a, b) {
    return { x: a.x * b.x, y: a.y * b.y };
}
/**
 * Divides `a` by `b`
 * @param a
 * @param b
 * @returns The quotient of `a` and `b`
 */
export function div(a, b) {
    return { x: a.x / b.x, y: a.y / b.y };
}
