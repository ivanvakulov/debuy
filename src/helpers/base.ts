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

export { isNil, omit }
