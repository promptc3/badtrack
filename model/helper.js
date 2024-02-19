import {database} from './database';

const habits = database.get('habits');

export const observeHabits = () => habits.query().observe();
export const allHabits = () => habits.query();
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
