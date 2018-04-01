import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const EbidCategories = new Mongo.Collection('ebidCategories');

const Schemas = {};

Schemas.EbidCategories = new SimpleSchema({
  category_id: {
    type: Number,
    index: 1,
  },
  parent_category: {
    type: String,
    max: 180,
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

EbidCategories.attachSchema(Schemas.EbidCategories);

export default EbidCategories;
