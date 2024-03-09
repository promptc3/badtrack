import {Model} from '@nozbe/watermelondb';
import {field, text, children} from '@nozbe/watermelondb/decorators';

export default class Habit extends Model {
  static table = 'habits';
  static associations = {
    habitlogs: {type: 'has_many', foreignKey: 'habit_id'},
  };

  @text('title') title;
  @text('icon') icon;
  @text('verb') verb;
  @text('habit_type') habitType;
  @field('scale_limit') scaleLimit;
  @text('scale_type') scaleType;
  @field('scale_step') scaleStep;
  @text('scale_unit') scaleUnit;
  @children('habitlogs') habitlogs;
}
