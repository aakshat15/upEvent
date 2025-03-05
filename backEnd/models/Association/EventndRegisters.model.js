import event from "../event.model.js";
import faculty from "../faculty.model.js";

// One faculty (Details) can create multiple events
faculty.hasMany(event, { foreignKey: "createdByfaculty" });

// Each event belongs to one faculty
event.belongsTo(faculty, { foreignKey: "createdByfaculty" });

export default { faculty, event }