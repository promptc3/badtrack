import {appSchema, tableSchema} from '@nozbe/watermelondb';

export default appSchema({
  version: 2,
  tables: [
    // We'll add tableSchemas here later
    // make some changes
    tableSchema({
      name: 'habits',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'icon', type: 'string'},
        {name: 'verb', type: 'string', isOptional: true},
      ],
    }),
    tableSchema({
      name: 'habitlogs',
      columns: [
        {name: 'scale', type: 'number'},
        {name: 'comment', type: 'string'},
        {name: 'habit_id', type: 'string', isIndexed: true},
        {name: 'created_at', type: 'number'},
      ],
    }),
  ],
});
