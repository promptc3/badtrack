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

// Habitlogs
export const observeLogs = () => habits.habitlogs.observe();

export const observeHabit = habitId => habits.findAndObserve(habitId);

export const logHabit = async ({scale, comment, habitId}) => {
  const refHabit = habits.find(habitId);
  await database.write(async () => {
    await database.get('habitlogs').create(log => {
      log.scale = scale;
      log.comment = comment;
      log.habit.set(refHabit);
    });
  });
};
