import * as api from './api';

export function addAppointmentEvent({name, start, end, slotInterval, description,color}) {
    slotInterval = parseInt(slotInterval);
    description = description || null;
    start = start.toISOString();
    end = end.toISOString();
    name = name;
    color = color;


    return api.addAppointmentEvent({name, slotInterval, description, start, end, color});
}