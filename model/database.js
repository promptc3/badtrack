import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import migrations from './migrations';

import Habit from './Habit';
import Habitlog from './Habitlog';

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  migrations,
  onSetUpError: error => {
    console.error('Failed to setup Watermelon DB', error);
  },
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [Habit, Habitlog],
});
