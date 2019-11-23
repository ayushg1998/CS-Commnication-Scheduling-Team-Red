import * as assert from 'assert';
export default class Controller {
  
  constructor({repository, viewDataMapper, appointmentEventId, appointmentId, onFinishListener}) {
    this.repository = repository;
    this.viewDataMapper = viewDataMapper;
    this.appointmentEventId = appointmentEventId;
    this.appointmentId = appointmentId;
    this.onFinishListener = onFinishListener;
    this.view = null;
    this.hasSuccessSubmission = false;
    this.appointmentEvent = null;
    this.appointment = null;

    //this is position of appointment during submission
    this.activePosition = -1;

    //this is position of appointment when fetched
    this.oldPosition = -1;
  }

  setView(view) {
    this.view = view;
  }

  async onViewStarted() {
    let appointment;
    try {
      appointment = await this.repository.getAppointment(this.appointmentId)
    } catch(err) {
      this._finish(); return;
    }

    this.oldPosition = this.activePosition = appointment.position;

    this.repository.getAppointmentEvent(this.appointmentEventId)
      .then(ape => {//TODO: this should be non null
        const mapper = this.viewDataMapper, v = this.view;
        this.appointmentEvent = ape;

        const viewModel = mapper.map(ape);
        v.setModalTitle("Edit Appointment");
        v.setAppointmentEventName(viewModel.appointmentEventName);
        v.setDescription(viewModel.description);
        v.setTime(viewModel.time);
        v.setAppointerName(viewModel.appointerName);
        v.setSlotOccupancy(viewModel.slotOccupancy);
        v.setAppointments(viewModel.appointments);
        v.setActiveAppointment(this.activePosition);
      })
      .catch(error => { this._finish(); })
  }

  onViewStopped() {

  }

  onAppointmentChange(position) {
    const ape = this.appointmentEvent, v = this.view;
    assert.ok(position < ape.slotCount && position >= 0);

    if (position == this.activePosition) return;

    const usedPositions = ape.appointments.map(ap => ap.position);
    if (usedPositions.indexOf(position) >= 0) return;

    this.activePosition = position;

    //TODO: this is ugly
    //mutate ape.appointments by changing position field of the particuar appointment
    const appointment = ape.appointments.find(ap => ap.id === this.appointmentId);
    appointment.position = position;

    //rerender appointment slots
    v.setAppointments(this.viewDataMapper.mapAppointments(ape));
    v.setActiveAppointment(position);
  }

  onSubmit() {
    const v = this.view;

    const oldPos = this.oldPosition;
    const newPos = this.activePosition;

    if (oldPos == newPos) {
      v.showAlert('Please pick a position first');
      return;
    }

    this.repository.updateAppointment({
      appointmentId: this.appointmentId,
      position: newPos
    })
      .then(() => {
        this.hasSuccessSubmission = true;
        this._finish();
      })
      .catch(err => { v.showAlert(err.message); });
  }

  onCloseClick() {
    this._finish();
  }

  _finish() {
    if (this.hasSuccessSubmission) {
      this.onFinishListener.onSubmitFinish();
    } else {
      this.onFinishListener.onPrematureFinish();
    }
  }
}