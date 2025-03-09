import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'userprofile'
  @text('firstName') 'firstName': string
  @text('lastName') 'lastName': string
  @text('aboutme') 'aboutme': string
  @text('city') 'city': string
  @text('email') 'email': string
  @text('gender') 'gender': string
  @text('dob') 'dob': string
  @text('phone') 'phone': string
  @text('profilePicture') 'profilePicture': string
}