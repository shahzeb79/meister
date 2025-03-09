import { Model } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
  static table = 'category';
  static associations = {
    subcategory: { type: 'has_many', foreignKey: 'category_id' },
  }
  @field('name') name;
  
  @children('subcategory') subcategory

}
