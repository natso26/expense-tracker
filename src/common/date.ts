export const parseDateTime = (date: string): Date | undefined => (
    date ? new Date(date) : undefined
)

export const parseDate = (date: string): Date | undefined => {
    if (!date) return undefined

    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset())
    return newDate
}

export const serializeDateForDateTimeInput = (date: Date | undefined): string => {
    if (!date) return ''

    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset())
    return newDate.toISOString().slice(0, 16)
}

export const serializeDateForDateInput = (date: Date | undefined): string => {
    if (!date) return ''

    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset())
    return newDate.toISOString().slice(0, 10)
}

export const addOneDay = (date: Date): Date => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 1)
    return newDate
}