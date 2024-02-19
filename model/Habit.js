import {Model} from '@nozbe/watermelondb';
import {text, children} from '@nozbe/watermelondb/decorators';

export default class Habit extends Model {
  static table = 'habits';
  static associations = {
    habitlogs: {type: 'has_many', foreignKey: 'habit_id'},
  };

  @text('title') title;
  @text('icon') icon;
  @text('verb') verb;
  @children('habitlogs') habitlogs;
}
