import {database} from './database';

// Habits
const habits = database.get('habits');

export const observeHabits = () => habits.query().observe();
export const allHabits = () => habits.query().fetch();
export const habitCount = () => habits.query().fetchCount();

export const saveHabit = async (title, icon, verb) => {
  await database.write(async () => {
    await database.get('habits').create(habit => {
      habit.title = title;
      habit.icon = icon;
      habit.verb = verb;
    });
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

export async function logHabit({scale, comment, habitId}) {
  const newLogWithHabit = await database.write(async () => {
    const refHabit = await database.get('habits').find(habitId);
    const newLog = await database.get('habitlogs').create(log => {
      log.habit.set(refHabit);
      log.scale = scale;
      log.comment = comment;
    });
    return newLog;
  });
  return newLogWithHabit;
}

// Function to fetch all logs from the database
export async function getAllLogs() {
  const logs = await database.get('habitlogs').query().fetch();
  return logs;
}
