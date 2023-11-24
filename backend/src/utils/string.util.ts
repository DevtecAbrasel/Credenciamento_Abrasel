// Checar se string é numérica
export function isNumeric(str: string): boolean {
    return !isNaN(+str);
}

export function stringToNumber(str: string) : number {
    if(!isNumeric(str)) {
        throw new Error("Não é possível converter string não numérica.")
    }
    return +str;
}
