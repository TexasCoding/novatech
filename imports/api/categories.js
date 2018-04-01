import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Categories = new Mongo.Collection('categories');

const Schemas = {};

Schemas.Categories = new SimpleSchema({
  parent_category: {
    type: String,
    max: 150,
  },
  category_id: {
    type: Number,
    index: 1,
  },
  category_name: {
    type: String,
    max: 150,
  },
  full_name: {
    type: String,
    max: 220,
    index: 1,
  },
  created_at: {
    type: Date,
    label: 'Created At',
    autoValue () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      return this.unset();
    },
  },
  updated_at: {
    type: Date,
    label: 'Updated At',
    autoValue () {
      if (this.isUpdate) {
        return new Date();
      }
      return this.unset();
    },
    // denyInsert: true,
    optional: true,
  },
});

Categories.attachSchema(Schemas.Categories);

export default Categories;
