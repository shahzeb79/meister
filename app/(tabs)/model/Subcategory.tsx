import { Model } from '@nozbe/watermelondb';
import { field, relation,children } from '@nozbe/watermelondb/decorators';

export default class Subcategory extends Model {
  static table = 'subcategory';
  static associations = {
    questions: { type: 'has_many', foreignKey: 'subcategory_id' },
  }
  @field('name') name;
  @relation('category', 'category_id') category_id
  @children('questions') questions
}
