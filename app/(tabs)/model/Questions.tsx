import { Model } from '@nozbe/watermelondb';
import { field, relation,json } from '@nozbe/watermelondb/decorators';
const sanitizeData = (data: any) => data;
export default class Questions extends Model {
  static table = 'questions';

  @field('question') question;
  @field('controltype') controltype;
  @field('key') key;
  @json('data', sanitizeData) data;

  @relation('subcategory', 'subcategory_id') subcategory_id
}
