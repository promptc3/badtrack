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
  @text('habit_type') habitType;
  @text('scale_limit') scaleLimit;
  @text('scale_type') scaleType;
  @text('scale_step') scaleStep;
  @text('scale_unit') scaleUnit;
  @children('habitlogs') habitlogs;
}
