import { Model } from '@nozbe/watermelondb';
import { field, date,readonly,json } from '@nozbe/watermelondb/decorators';
const sanitizeQuestions = (data: any) => data;
export default class Questions extends Model {
  static table = 'posting';

  @field('userid') userid;
  @field('category') category;
  @field('subcategory') subcategory;
  @readonly @date('created_at') createdAt
  @readonly @date('updated_at') updatedAt
  @json('questions', sanitizeQuestions) questions;

}
