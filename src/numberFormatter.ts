export function useNumberFormat(locale = 'es-AR') {
    const format = (value: number, options = {}) => {
        if (value === null || value === undefined || isNaN(value)) return ''
        return new Intl.NumberFormat(locale, options).format(value)
    }

    return { format }
}