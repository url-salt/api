export function generateCharacterArray(begin: string, end: string) {
    const beginCode = begin.charCodeAt(0);
    const endCode = end.charCodeAt(0);
    const result: string[] = [];
    for (let i = beginCode; i <= endCode; ++i) {
        result.push(String.fromCharCode(i));
    }

    return result;
}
