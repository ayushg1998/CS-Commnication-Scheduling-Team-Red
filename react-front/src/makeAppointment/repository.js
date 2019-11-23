import * as api from '../shared/api';

export default class Repository {

  addAppointment({position, appointmentEventId}) {
    return api.addAppointment({position, appointmentEventId});
  }

  /*@return promise never resolves to null*/
  getAppointmentEvent(appointmentEventId) {
    return api.getAppointmentEvent(appointmentEventId)
      .then(ape => {
        if (!ape) throw new Error('AppointmentEvent not found');
        return ape;
      })
  }

  getAppointment(appointmentId) {
    return api.getAppointment(appointmentId)
      .then(ap => {
        if (!ap) throw new Error('Appointment not found');
        return ap;
      })
  }

  updateAppointment({appointmentId, position}) {
    return api.updateAppointment({appointmentId, position});
  }
}