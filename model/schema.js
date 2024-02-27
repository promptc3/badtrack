import {appSchema, tableSchema} from '@nozbe/watermelondb';

export default appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'habits',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'icon', type: 'string'},
        {name: 'verb', type: 'string', isOptional: true},
        {name: 'habit_type', type: 'string'},
        {name: 'scale_limit', type: 'number'},
        {name: 'scale_type', type: 'string'},
        {name: 'scale_step', type: 'number'},
        {name: 'scale_unit', type: 'string', isOptional: true},
      ],
    }),
    tableSchema({
      name: 'habitlogs',
      columns: [
        {name: 'scale', type: 'number'},
        {name: 'comment', type: 'string'},
        {name: 'habit_id', type: 'string', isIndexed: true},
        {name: 'created_at', type: 'number'},
        {name: 'render_color', type: 'string'},
        {name: 'logged_at', type: 'number', isOptional: true},
      ],
    }),
  ],
});
