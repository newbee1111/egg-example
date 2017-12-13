// module.exports = app => {
//   const { STRING, INTEGER } = app.Sequelize;

//   const Event = app.model.define('test', {
//     event: STRING(100),
//     status: INTEGER,
//   });

//   Event.getEvent = function* (id) {
//     const eventObj = yield this.findOne({ id });
//     return eventObj;
//   };

//   Event.getEvents = function* () {
//     const events = yield this.findAll();
//     return events;
//   };

//   Event.addEvent = function* (eventObj) {
//     const { event, status } = eventObj;
//     const result = yield this.create({ event, status });
//     return result;
//     // if (result.affectedRows) {
//     //   return { message: 'success' };
//     // }
//     // return { message: 'failure' };
//   };

//   Event.updateEvent = function* (id) {
//     const { status } = yield this.getEvent(id);
//     const result = yield this.update({ status: !status }, { where: { id } });
//     return result;
//   };

//   Event.deleteEvent = function* (id) {
//     const result = yield this.destroy({ where: { id } });
//     return result;
//   };

//   return Event;
// };
