// Checar se string é numérica
export function isNumeric(str) {
    return !isNaN(+str);
}
export function stringToNumber(str) {
    if (!isNumeric(str)) {
        throw new Error("Não é possível converter string não numérica.");
    }
    return +str;
}
//# sourceMappingURL=string.util.js.map