export const serializeDateForInput = (date: Date) => {
    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset())
    return newDate.toISOString().slice(0, 16);
}