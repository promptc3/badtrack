import {
  addColumns,
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'habits',
          columns: [
            {name: 'habit_type', type: 'string'},
            {name: 'scale_limit', type: 'number'},
            {name: 'scale_type', type: 'string'},
            {name: 'scale_step', type: 'number'},
            {name: 'scale_unit', type: 'string'},
          ],
        }),
        addColumns({
          table: 'habitlogs',
          columns: [
            {name: 'render_color', type: 'string'},
            {name: 'logged_at', type: 'number'},
          ],
        }),
      ],
    },
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
