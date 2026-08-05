export function getPeruTime(secondsToAdd: number = 0): string {

    // Creado para obtener la hora actual en Perú (UTC-5) y sumarle segundos si es necesario. Devuelve un string con la fecha y hora en formato local.
    // Usado únicamente para mostrar la hora de Perú al usuario final.

    // Hora actual en UTC
    const now = new Date();

    // Offset de Perú (UTC-5)
    const peruOffset = -5 * 60; // -5horas
    const utc = now.getTime() + now.getTimezoneOffset() * 60000; // tiempo UTC en ms

    // Hora Perú en ms
    const peruTime = new Date(utc + peruOffset * 60000);

    // Sumar segundos
    peruTime.setSeconds(peruTime.getSeconds() + secondsToAdd);

    // Formatear a string en formato local
    return peruTime.toLocaleString("es-PE");

}