import * as DateUtils from '../shared/dateUtils';
const moment = DateUtils.moment;

const NA = 'NA';

export default class ViewDataMapper {

  /*@param ape, appointmentEvent of structure
  {
    id,
    description,
    start,
    name, color
    end,
    slotInterval,
    slotCount,
    appointer: {
      fname,
      lname,
      id
    },
    appointments: Array<{
      id,
      start,
      end,
      position,
      appointmentEventId,
      appointee: {
        fname,
        lname,
        id
      }
    }>
  }
  }
  */
  map(ape) {
    //view model
    const vm = {};

    vm.appointmentEventName = ape.name || NA;
    vm.description = ape.description || NA;
    
    // vm.time = (function() {
    //   const start = moment(ape.start);
    //   const end = moment(ape.end);
    //   const f = t => t.format('MMM DD') + ', ' + 
    //     t.format('YYYY') + ', ' + t.format('hh:mma');
    //   return `${f(start)} - ${f(end)}`
    // })();
    vm.time = `${DateUtils.format_ymdh(ape.start)} - ${DateUtils.format_ymdh(ape.end)}`;

    vm.appointerName = ape.appointer.fname + ' ' + ape.appointer.lname;

    vm.slotOccupancy = (function() {
      const occupied = ape.appointments.length;
      const total = ape.slotCount;

      return `(${occupied}/${total})`;
    })();

    vm.appointments = this.mapAppointments(ape);

    return vm;
  }

  mapAppointments(ape) {
    const ret = [];
    const s = moment(ape.start);

    for(let i = 0; i < ape.slotCount; i++) {
      const ap = ape.appointments.find(ap => ap.position === i);
      
      const name = (function() {
        return ap? `${ap.appointee.fname} ${ap.appointee.lname}`: '-';
      })();

      const time = (function() {
        const startOffset = ape.slotInterval * i;
        const endOffset = ape.slotInterval + startOffset;

        const start = s.clone().add(startOffset, 'minutes');
        const end = s.clone().add(endOffset, 'minutes');

        return `${start.format('hh:mma')} - ${end.format('hh:mma')}`;
      })();

      const isOccupied = ap? true: false;
      const position = i;

      ret.push({name, time, isOccupied, position});
    }

    return ret;
  }
}