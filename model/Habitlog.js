import {Model} from '@nozbe/watermelondb';
import {
  text,
  number,
  relation,
  readonly,
  date,
} from '@nozbe/watermelondb/decorators';

export default class Habitlog extends Model {
  static table = 'habitlogs';
  static associations = {
    habits: {type: 'belongs_to', key: 'habit_id'},
  };

  @number('scale') scale;
  @text('comment') comment;
  @text('render_color') renderColor;
  @date('logged_at') loggedAt;
  @relation('habits', 'habit_id') habit;
  @readonly @date('created_at') createdAt;
}
