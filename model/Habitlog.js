import {Model} from '@nozbe/watermelondb';
import {text, relation, readonly, date} from '@nozbe/watermelondb/decorators';

export default class Habitlog extends Model {
  static table = 'habitlogs';
  static associations = {
    habits: {type: 'belongs_to', key: 'habit_id'},
  };

  @text('scale') scale;
  @text('comment') comment;
  @relation('habits', 'habit_id') habit;
  @readonly @date('created_at') createdAt;
}
