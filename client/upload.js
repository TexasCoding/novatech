import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Papa from 'papaparse';
import swal from 'sweetalert';

import * as exporter from './exporter';


import './upload.html';

Template.upload.onCreated(() => {
  Template.instance().uploadCount = new ReactiveVar(0);
  Template.instance().errorCount = new ReactiveVar(0);
  Template.instance().productCount = new ReactiveVar(0);
});

Template.upload.helpers({
  uploadCount () {
    return Template.instance().uploadCount.get();
  },
  errorCount () {
    return Template.instance().errorCount.get();
  },
  productCount () {
    return Template.instance().productCount.get();
  },
  progressPercentage () {
    const multiplier = 100 / Template.instance().productCount.get();
    const addedCount = Template.instance().uploadCount.get() + Template.instance().errorCount.get();
    return addedCount * multiplier;
  },
  progressFinished (count) {
    return count ? count === 100 : true;
  },
});

Template.upload.events({
  'click #export' () {
    // event.preventDefault();
    exporter.csvExporter.export();
  },
  'click #removeProducts' () {
    // event.preventDefault();
    Meteor.call('removeProducts', (error, result) => {
      if (error) {
        swal('Error!', error.reason);
      } else {
        swal('Removed', `${result} products!`, 'success');
      }
    });
  },
  'click #exportEbid' () {
    exporter.csvEbidExporter.export();
  },
  'change [name="uploadInventoryCSV"]' (event, templateInstance) {
    event.preventDefault();
    if (Meteor.call('removeProducts') !== null) {
      Papa.parse(event.target.files[0], {
        header: true,
        step (results) {
          Meteor.call('parseUpload', results.data, (error, result) => {
            if (error) {
              templateInstance.errorCount.set(templateInstance.errorCount.get() + 1);
            }
            if (result) {
              templateInstance.uploadCount.set(templateInstance.uploadCount.get() + 1);
            }

            if (templateInstance.productCount.get() ===
              templateInstance.errorCount.get() + templateInstance.uploadCount.get() + 1) {
              swal(`(${templateInstance.uploadCount.get() + 1}) products have been successfully uploaded!`)
                .then(() => {
                  templateInstance.errorCount.set(0);
                  templateInstance.uploadCount.set(0);
                  templateInstance.productCount.set(0);
                });
            }
          });
          templateInstance.productCount.set(templateInstance.productCount.get() + 1);
        },
      });
    }
  },
  'change [name="uploadEbidCategoriesCSV"]' (event, templateInstance) {
    event.preventDefault();

    Papa.parse(event.target.files[0], {
      header: false,
      step (results) {
        Meteor.call('parseEbidCategoy', results.data, (error, result) => {
          if (error) {
            templateInstance.errorCount.set(templateInstance.errorCount.get() + 1);
          }
          if (result) {
            templateInstance.uploadCount.set(templateInstance.uploadCount.get() + 1);
          }

          if (templateInstance.productCount.get() ===
            templateInstance.errorCount.get() + templateInstance.uploadCount.get() + 1) {
            swal(`(${templateInstance.uploadCount.get()}) Ebid categories have been successfully uploaded!`)
              .then(() => {
                templateInstance.errorCount.set(0);
                templateInstance.uploadCount.set(0);
                templateInstance.productCount.set(0);
              });
          }
        });
        templateInstance.productCount.set(templateInstance.productCount.get() + 1);
      },
    });
  },
  'change [name="uploadBonanzaCategoriesCSV"]' (event, templateInstance) {
    event.preventDefault();

    Papa.parse(event.target.files[0], {
      header: true,
      step (results) {
        Meteor.call('parseBonanzaCategory', results.data, (error, result) => {
          if (error) {
            templateInstance.errorCount.set(templateInstance.errorCount.get() + 1);
          }
          if (result) {
            templateInstance.uploadCount.set(templateInstance.uploadCount.get() + 1);
          }

          if (templateInstance.productCount.get() ===
            templateInstance.errorCount.get() + templateInstance.uploadCount.get() + 1) {
            swal(`(${templateInstance.uploadCount.get()}) Bonanza categories have been successfully uploaded!`)
              .then(() => {
                templateInstance.errorCount.set(0);
                templateInstance.uploadCount.set(0);
                templateInstance.productCount.set(0);
              });
          }
        });
        templateInstance.productCount.set(templateInstance.productCount.get() + 1);
      },
    });
  },
});

// 'change [name="uploadOutOfDateCSV"]' (event, templateInstance) {
//   event.preventDefault();
//   templateInstance.uploading.set(true);
//
//   Papa.parse(event.target.files[0], {
//     header: true,
//     // preview: 20,
//     step (results) {
//       Meteor.call('parseOutOfDateUpload', results.data, (error, result) => {
//         if (error) {
//           console.log(error.reason);
//         }
//         console.log(result);
//       });
//     },
//     complete () {
//       templateInstance.uploading.set(false);
//     },
//   });
// },
// 'submit form' (event) {
//   event.preventDefault();
//   exporter.csvEbidExporterBrand.export(event.target.brand.value);
// },
// 'click #exportUpdated' () {
//   // event.preventDefault();
//   exporter.csvUpdatedExporter.export();
// },
// 'click #removeAll' () {
//   // event.preventDefault();
//   Meteor.call('removeAll', (error, result) => {
//     if (error) {
//       swal('Error!', error.reason);
//     } else {
//       swal('Removed', `${result}`, 'success');
//     }
//   });
// },
