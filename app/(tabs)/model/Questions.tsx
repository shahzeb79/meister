import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class Questions extends Model {
  static table = 'questions';

  @field('question') question;
  @field('controltype') controltype;
  @field('key') key;
  @relation('subcategory', 'subcategory_id') subcategory_id
}
