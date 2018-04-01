import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import productFunctions from '../functions';

const Products = new Mongo.Collection('products');

const Schemas = {};


Schemas.Product = new SimpleSchema({
  entity_id: {
    type: String,
    label: 'Entity ID',
    max: 85,
  },
  sku: {
    type: String,
    label: 'SKU',
    max: 85,
    index: 1,
  },
  cost_free_member: {
    type: Number,
    label: 'Free Member Cost',
  },
  cost_pro_member: {
    type: Number,
    label: 'Pro Member Cost',
  },
  sale_price_bonanza: {
    type: Number,
    label: 'Bonanza Sale Price',
    autoValue () {
      return productFunctions.calcPrice(this.field('cost_pro_member').value, this.field('shipping_cost').value, 6.75, 3.5);
    },
  },
  sale_price_ebid: {
    type: Number,
    label: 'Bonanza Sale Price',
    autoValue () {
      return productFunctions.calcPrice(this.field('cost_pro_member').value, this.field('shipping_cost').value, 6.75, 2.0);
    },
  },
  manufacturer: {
    type: String,
    label: 'Manufacturer',
    max: 85,
  },
  map_price: {
    type: Number,
    label: 'MAP Price',
  },
  model_number: {
    type: String,
    label: 'Model Number',
    max: 85,
  },
  mpn: {
    type: String,
    label: 'MPN',
    max: 85,
  },
  name: {
    type: String,
    label: 'Name',
    max: 300,
  },
  title: {
    type: String,
    label: 'Name',
    autoValue () {
      if (this.isInsert) {
        return productFunctions.title(this.field('name').value, this.field('mpn').value);
      }
      return this.unset();
    },
  },
  height: {
    type: Number,
    label: 'height',
  },
  length: {
    type: Number,
    label: 'length',
  },
  width: {
    type: Number,
    label: 'Width',
  },
  weight: {
    type: Number,
    label: 'Weight',
  },
  shipping_cost: {
    type: Number,
    label: 'Shipping Cost',
  },
  ship_from_location: {
    type: String,
    label: 'Ship From',
  },
  upc_code: {
    type: String,
    label: 'UPC',
    max: 80,
  },
  warranty: {
    type: String,
    label: 'Warranty',
  },
  qty: {
    type: Number,
    label: 'Quantity',
    index: 1,
  },
  return_policy: {
    type: String,
    label: 'Return Policy',
  },
  image_url: {
    type: String,
    label: 'Image URL',
  },
  additional_images: {
    type: String,
    label: 'Additional Images',
  },
  condition_description: {
    type: String,
    label: 'Condition Description',
  },
  description: {
    type: String,
    label: 'Description',
  },
  package_includes: {
    type: String,
    label: 'Package Includes',
  },
  category_path: {
    type: String,
    label: 'Category Path',
  },
  category: {
    type: Number,
    label: 'Bonanza Category',
    autoValue () {
      if (this.isInsert) {
        return productFunctions.bonazaCategory(this.field('category_path').value);
      }
      return this.unset();
    },
    index: 1,
  },
  ebid_category: {
    type: Number,
    label: 'Ebid Category',
    autoValue () {
      if (this.isInsert) {
        return productFunctions.ebidCategory(this.field('category_path').value);
      }
      return this.unset();
    },
  },
  condition: {
    type: String,
    label: 'Condition',
    max: 20,
  },
  full_description: {
    type: String,
    label: 'Full Description',
    autoValue () {
      if (this.isInsert) {
        return productFunctions.fullDescription(this.field('name').value, this.field('description').value, this.field('package_includes').value, this.field('condition_description').value, this.field('warranty').value, this.field('return_policy').value);
      }
      return this.unset();
    },
  },
  trait: {
    type: String,
    label: 'Traits',
    autoValue () {
      if (this.isInsert) {
        return productFunctions.traits(this.field('manufacturer').value, this.field('condition').value, this.field('mpn').value, this.field('upc_code').value);
      }
      return this.unset();
    },
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


Products.attachSchema(Schemas.Product);

export default Products;
