import * as api from './api';

export function addAppointmentEvent({start, end, slotInterval, description}) {
    slotInterval = parseInt(slotInterval);
    description = description || null;
    start = start.toISOString();
    end = end.toISOString();

    return api.addAppointmentEvent({slotInterval, description, start, end});
}