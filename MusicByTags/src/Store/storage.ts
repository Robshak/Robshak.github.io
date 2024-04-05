export function loadState<T>(key: string): T | undefined {
    try {
        const jsonState = localStorage.getItem(key);
        if (!jsonState) {
            return undefined;
        }
        return JSON.parse(jsonState);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

export function saveState<T>(key: string, data: T): void {
    const stringState = JSON.stringify(data);
    localStorage.setItem(key, stringState);
}