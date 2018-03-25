import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './exporter';

import { Products } from '../imports/api/products';
import './upload.html';

Template.upload.onCreated(() => {
    Template.instance().uploading = new ReactiveVar(false);
});

Template.upload.helpers({
    uploading() {
        return Template.instance().uploading.get();
    }
});

Template.upload.events({
    'click #export'() {
        console.log('started download');
        csvExporter.export();
    },
    'click #exportEbid'() {
        console.log('started download');
        csvEbidExporter.export();
    },
    'submit form'(event) {
        event.preventDefault();
        console.log('started download ' + event.target.brand.value);
        csvEbidExporterBrand.export(event.target.brand.value);
    },
    'change [name="uploadCSV"]'(event, template) {
        template.uploading.set(true);
        

        if (event.target.files[0].name === 'bonanza.csv') {
            Papa.parse(event.target.files[0], {
                header: true,
                step(results) {

                    console.log('Importing from Bonanza file..');
                    Meteor.call('parseBonanza', results.data, (error, response) => {
                        if (error) {
                            Bert.alert(error.reason, 'warning');
                        }
                    });

                },
                complete() {
                    console.log('The bonanza file has been updated!');
                    template.uploading.set(false);
                    Bert.alert('Uploading complete!', 'success', 'growl-top-right');
                }
            });
        } else {
            Meteor.call('removeAll');
            Papa.parse(event.target.files[0], {
                header: true,
                step(results) {
                    console.log('Importing from Inventory file..');

                    Meteor.call('parseUpload', results.data, (error, response) => {
                        if (error) {
                            console.log(error.reason);
                        } 
                    });

                },
                complete() {
                    console.log('The inventory file has been updated!');
                    template.uploading.set(false);
                    Bert.alert('Uploading complete!', 'success', 'growl-top-right');
                }
            });
        }

    }
});