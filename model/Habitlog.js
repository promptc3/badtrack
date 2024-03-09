import {Model} from '@nozbe/watermelondb';
import {
  field,
  text,
  relation,
  date,
  readonly,
} from '@nozbe/watermelondb/decorators';

export default class Habitlog extends Model {
  static table = 'habitlogs';
  static associations = {
    habits: {type: 'belongs_to', key: 'habit_id'},
  };

  @field('scale') scale;
  @text('comment') comment;
  @text('render_color') renderColor;
  @date('logged_at') loggedAt;
  @relation('habits', 'habit_id') habit;
  @readonly @date('created_at') createdAt;
}
