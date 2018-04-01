import { Meteor } from 'meteor/meteor';
import Papa from 'papaparse';

function downloadCSV (csv, file) {
  const blob = new Blob([csv]);
  const a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(blob, { type: 'text/plain' });
  a.download = file;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export const csvExporter = {
  export () {
    Meteor.call('exportProducts', (error, data) => {
      if (error) {
        throw new Meteor.Error(error);
      }

      const csv = Papa.unparse(data);
      downloadCSV(csv, 'products.csv');
      return 0;
    });
  },
};


export const csvUpdatedExporter = {
  export () {
    Meteor.call('exportUpdatedProducts', (error, data) => {
      if (error) {
        throw new Meteor.Error(error);
      }

      const csv = Papa.unparse(data);
      downloadCSV(csv, 'products.csv');
      return 0;
    });
  },
};

export const csvEbidExporter = {
  export () {
    Meteor.call('exportProductsEbid', (error, data) => {
      if (error) {
        throw new Meteor.Error(error);
      }

      const csv = Papa.unparse(data, {
        delimiter: '\t',
      });
      downloadCSV(csv, 'products.txt');
      return 0;
    });
  },

};

export const csvEbidExporterBrand = {
  export (brand) {
    Meteor.call('exportProductsEbidBrand', brand, (error, data) => {
      if (error) {
        throw new Meteor.Error(error);
      }

      const csv = Papa.unparse(data, {
        delimiter: '\t',
      });
      downloadCSV(csv, 'brandEbid.txt');
      return 0;
    });
  },
};

