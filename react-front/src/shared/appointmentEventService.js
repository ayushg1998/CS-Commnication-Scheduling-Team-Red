import * as api from './api';

export function addAppointmentEvent({name, start, end, slotInterval, description,color}) {
    name = name;
    start = start.toISOString();
    end = end.toISOString();
    slotInterval = parseInt(slotInterval);
    description = description || null;
    color = color;


    return api.addAppointmentEvent({name, slotInterval, description, start, end, color});
}