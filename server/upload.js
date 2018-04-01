import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Products from '../imports/api/products';
import Categories from '../imports/api/categories';
import EbidCategories from '../imports/api/ebidCategories';

function ebidCondition (condition) {
  if (condition === 'New') {
    return 'new';
  }
  return 'used';
}

Meteor.methods({
  exportProducts () {
    const fields = [
      'id',
      'title',
      'description',
      'price',
      'images',
      'category',
      'shipping_price',
      'shipping_type',
      'sku',
      'qty',
      'trait',
      'force_update',
    ];

    const data = [];
    const products = Products.find({ category: { $gt: 0 }, qty: { $gte: 3 } }).fetch();

    _.each(products, (c) => {
      const addAdditional = `,${c.additional_images}`;
      const allImages = c.image_url + c.additional_images !== '' ? addAdditional : '';

      data.push([
        c.sku,
        c.title,
        c.full_description,
        c.sale_price_bonanza,
        allImages,
        c.category,
        0,
        'free',
        c.sku,
        c.qty,
        c.trait,
        'true',
      ]);
    });

    return { fields, data };
  },
  exportProductsEbid () {
    const fields = [
      'Username',
      'Category id',
      'eBid Store Category',
      'Barcode',
      'Auction Title',
      'Image URL',
      'Item Condition',
      'Quantity',
      'Start',
      'End',
      'Starting Bid',
      'Sales Tax',
      'Reserve',
      'Feature',
      'YouTube Video ID',
      'BuyNow Price',
      'Brand',
      'Domestic Shipping',
      'International Shipping',
      'Payment Methods',
      'Auto Repost',
      'SKU',
      'Dispatch Time',
      'Return Policy',
      'Description',
      'Action',
      'End',
    ];

    const data = [];
    const products = Products.find({ ebid_category: { $gt: 0 }, qty: { $gte: 3 } }).fetch();

    _.each(products, (c) => {
      if (c.ebid_category !== '0') {
        const images = `${c.image_url}##${c.additional_images}`;
        data.push([
          'aegisaccessories',
          c.ebid_category,
          '',
          c.upc_code !== 'na' ? c.upc_code : '',
          c.title,
          images.replace(/,/gi, '##'),
          ebidCondition(c.condition),
          c.qty,
          'Immediate',
          'run until sold',
          '1.00',
          '',
          '',
          'Gallery',
          '',
          c.sale_price_ebid,
          c.manufacturer,
          '03=0.00',
          '01',
          '5',
          '0',
          c.sku,
          '2',
          '2',
          c.full_description,
          'ao',
          '##end##',
        ]);
      }
    });
    return { fields, data };
  },
  removeProducts () {
    return Products.remove({});
  },
  parseUpload (data) {
    check(data, Array);
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].entity_id) {
        const itemNew = {
          entity_id: data[i].entity_id,
          sku: data[i].sku,
          cost_free_member: data[i].cost_free_member,
          cost_pro_member: data[i].cost_pro_member,
          manufacturer: data[i].manufacturer,
          map_price: data[i].map_price,
          model_number: data[i].model_number,
          mpn: data[i].mpn,
          name: data[i].name,
          height: data[i].height,
          length: data[i].length,
          width: data[i].width,
          shipping_cost: data[i].shipping_cost,
          ship_from_location: data[i].ship_from_location,
          upc_code: data[i].upc_code.match(/^[0-9]+$/) ? data[i].upc_code : 'na',
          warranty: data[i].warranty,
          weight: data[i].weight,
          qty: data[i].qty,
          return_policy: data[i].return_policy,
          image_url: data[i].image_url,
          additional_images: data[i].additional_images,
          condition_description: data[i].condition_description,
          description: data[i].description,
          package_includes: data[i].package_includes,
          category_path: data[i].category_path,
          condition: data[i].condition,
        };

        return Products.insert(itemNew);
      }
    }
    return true;
  },
  parseBonanzaCategory (data) {
    check(data, Array);
    const cat = [];
    for (let i = 0; i < data.length; i += 1) {
      if (data[i]['Category ID']) {
        const category = {
          parent_category: data[i]['Parent Category'],
          category_id: data[i]['Category ID'],
          category_name: data[i]['Category Name'],
          full_name: data[i]['Full Name'],
        };

        cat[i] = Categories.insert(category);
      }
    }
    return cat;
  },
  parseEbidCategoy (data) {
    check(data, Array);
    const cat = [];
    for (let i = 0; i < data.length; i += 1) {
      if (data[i][0]) {
        const category = {
          category_id: data[i][0],
          parent_category: data[i][1],
          full_name: data[i][2],
        };
        cat[i] = EbidCategories.insert(category);
      }
    }
    return cat;
  },
});

// removeAll () {
//   Products.remove({});
//   Categories.remove({});
//   EbidCategories.remove({});
//   return 'Database has been cleared!';
// },
// parseOutOfDateUpload (data) {
//   check(data, Array);
//
//   for (let i = 0; i < data.length; i += 1) {
//     if (data[i].sku) {
//       const itemUpdate = {
//         qty: data[i].qty,
//       };
//       const product = Products.findOne({ sku: data[i].sku });
//
//       if (product) {
//         if (product.qty !== itemUpdate.qty) {
//           Products.update(product._id, {
//             $set: itemUpdate,
//           });
//           return true;
//         }
//         return false;
//       }
//     }
//   }
//   return true;
// },
