export const parseDate = (date: string): Date | undefined => (
    date ? new Date(date) : undefined
)

export const serializeDateForInput = (date: Date | undefined): string => {
    if (!date) return ''

    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset())
    return newDate.toISOString().slice(0, 16);
}