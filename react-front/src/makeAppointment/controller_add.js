import * as assert from 'assert';
export default class Controller {
  
  constructor({repository, viewDataMapper, appointmentEventId, onFinishListener}) {
    this.repository = repository;
    this.viewDataMapper = viewDataMapper;
    this.appointmentEventId = appointmentEventId;
    this.onFinishListener = onFinishListener;
    this.view = null;
    this.hasSuccessSubmission = false;
    this.appointmentEvent = null;
    this.activePosition = -1;
  }

  setView(view) {
    this.view = view;
  }

  onViewStarted() {
    this.repository.getAppointmentEvent(this.appointmentEventId)
      .then(ape => {//TODO: this should be non null
        const mapper = this.viewDataMapper, v = this.view;
        this.appointmentEvent = ape;

        const viewModel = mapper.map(ape);
        v.setModalTitle("Make an Appointment");
        v.setAppointmentEventName(viewModel.appointmentEventName);
        v.setDescription(viewModel.description);
        v.setTime(viewModel.time);
        v.setAppointerName(viewModel.appointerName);
        v.setSlotOccupancy(viewModel.slotOccupancy);
        v.setAppointments(viewModel.appointments);
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
    v.setActiveAppointment(position);
  }

  onSubmit() {
    const v = this.view;

    if (this.activePosition == -1) { 
      v.showAlert('Please pick a position first');
      return;
    }

    this.repository.addAppointment({position: this.activePosition, 
      appointmentEventId: this.appointmentEventId})
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