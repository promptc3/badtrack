import {database} from './database';

// Habits
const habits = database.get('habits');

export const observeHabits = () => habits.query().observe();
export const allHabits = () => habits.query().fetch();
export const habitCount = () => habits.query().fetchCount();

export const saveHabit = async ({
  title,
  icon,
  verb,
  habitType,
  scaleLimit,
  scaleType,
  scaleStep,
  scaleUnit,
}) => {
  await database.write(async () => {
    await database.get('habits').create(habit => {
      habit.title = title;
      habit.icon = icon;
      habit.verb = verb;
      habit.habitType = habitType;
      habit.scaleLimit = scaleLimit;
      habit.scaleType = scaleType;
      habit.scaleStep = scaleStep;
      habit.scaleUnit = scaleUnit;
    });
  });
};

export const updateHabit = async ({habit, newTitle, newIcon, newVerb}) => {
  await database.write(async () => {
    await habit.update(h => {
      h.title = newTitle;
      h.icon = newIcon;
      h.verb = newVerb;
    });
  });
};

export const deleteHabit = async habit => {
  await database.write(async () => {
    await habit.destroyPermanently();
  });
};

export const observeHabit = habitId => habits.findAndObserve(habitId);

export async function getHabitFromHabitId(habitId) {
  const habit = await habits.find(habitId);
  return habit;
}

// Habitlogs
const habitlogs = database.get('habitlogs');
export const observeLogs = () => habitlogs.query.observe();

// Function to fetch logs related to a habit by its ID
export async function fetchLogsByHabitId(habitId) {
  const habit = await habits.find(habitId);
  const logs = await habit.habitlogs;
  return logs;
}

export async function logHabit({scale, comment, habit, renderColor}) {
  const newLogWithHabit = await database.write(async () => {
    const newLog = await database.get('habitlogs').create(log => {
      log.habit.set(habit);
      log.scale = scale;
      log.comment = comment;
      log.renderColor = renderColor;
    });
    return newLog;
  });
  return newLogWithHabit;
}

export const deleteLog = async log => {
  await database.write(async () => {
    await log.destroyPermanently();
  });
};

// Function to fetch all logs from the database
export async function getAllLogs() {
  const logs = await database.get('habitlogs').query().fetch();
  return logs;
}
