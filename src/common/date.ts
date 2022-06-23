export const parseDateTime = (date: string): Date | null => (
    date ? new Date(date) : null
)

export const parseDate = (date: string): Date | null => {
    if (!date) return null

    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset())
    return newDate
}

export const serializeForDateTimeInput = (date: Date | null): string => {
    if (!date) return ''

    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset())
    return newDate.toISOString().slice(0, 16)
}

export const serializeForDateInput = (date: Date | null): string => {
    if (!date) return ''

    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset())
    return newDate.toISOString().slice(0, 10)
}

export const onReferenceDate = (date: Date, referenceDate: Date): Boolean => {
    const difference = date.getTime() - referenceDate.getTime()

    return difference >= 0 && difference < millisecondsInDay
}

export const onSameDate = (date1: Date, date2: Date): Boolean => {
    const value1 = date1.getTime() - date1.getTimezoneOffset() * millisecondsInMinute
    const value2 = date2.getTime() - date2.getTimezoneOffset() * millisecondsInMinute

    return value1 - value1 % millisecondsInDay === value2 - value2 % millisecondsInDay
}

const millisecondsInMinute = 60 * 1000
const millisecondsInDay = 24 * 60 * millisecondsInMinute