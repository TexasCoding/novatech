csvExporter = {
    export() {
        let self = this;
        Meteor.call("exportProducts", (error, data) => {
            if(error) {
                alert(error);
                return false;
            }

            let csv = Papa.unparse(data);
            self._downloadCSV(csv);
        });
    },

    _downloadCSV: function(csv) {
		var blob = new Blob([csv]);
		var a = window.document.createElement("a");
	    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
	    a.download = "products.csv";
	    document.body.appendChild(a);
	    a.click();
	    document.body.removeChild(a);
	}
}

csvEbidExporter = {
    export() {
        let self = this;
        Meteor.call("exportProductsEbid", (error, data) => {
            if(error) {
                alert(error);
                return false;
            }

            let csv = Papa.unparse(data, {
                delimiter: "\t",
            });
            self._downloadCSV(csv);
        });
    },

    _downloadCSV: function(csv) {
		var blob = new Blob([csv]);
		var a = window.document.createElement("a");
	    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
	    a.download = "products.txt";
	    document.body.appendChild(a);
	    a.click();
	    document.body.removeChild(a);
	}
}

csvEbidExporterBrand = {
    export(brand) {
        let self = this;
        Meteor.call("exportProductsEbidBrand", brand, (error, data) => {
            if(error) {
                alert(error);
                return false;
            }

            let csv = Papa.unparse(data, {
                delimiter: "\t",
            });
            self._downloadCSV(csv);
        });
    },

    _downloadCSV: function(csv) {
		var blob = new Blob([csv]);
		var a = window.document.createElement("a");
	    a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
	    a.download = "brandEbid.txt";
	    document.body.appendChild(a);
	    a.click();
	    document.body.removeChild(a);
	}
}