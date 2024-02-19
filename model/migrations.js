import {
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'habits',
          columns: [
            {name: 'title', type: 'string'},
            {name: 'icon', type: 'string'},
            {name: 'verb', type: 'string'},
          ],
        }),
        createTable({
          name: 'habitlogs',
          columns: [
            {name: 'scale', type: 'number'},
            {name: 'comment', type: 'string'},
            {name: 'habit_id', type: 'string', isIndexed: true},
            {name: 'created_at', type: 'number'},
          ],
        }),
      ],
    },
  ],
});
