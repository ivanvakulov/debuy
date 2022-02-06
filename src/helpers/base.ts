function isNil(value: any) {
    return value === undefined || value === null
}

const omit =
    <T, K extends keyof T>(property: K, obj: T): Omit<T, K> => (Object.keys(obj) as Array<keyof T>).reduce(
        (acc, key) => {
            if (key !== property) {
                acc[key] = obj[key]
            }

            return acc
        }, {} as T
    )

function getUniqueNumberId(id: number, increment: number = 3): number {
    if (id >= Number.MAX_VALUE || `${id}`.length + increment >= `${Number.MAX_VALUE}`.length) { return id }
    return Number(`${id}${Math.round(Math.random() * (10 ** increment))}`)
}

const range = (start: number, end: number) => {
    // @ts-ignore
    return Array(end - start).fill().map((_, idx) => start + idx)
}

export { isNil, omit, getUniqueNumberId, range }
