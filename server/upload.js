import { Products } from '../imports/api/products';

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function _calcPrice(price, shipping, mark, fee) {
    let ship = precisionRound(shipping, 2);
    let priceSet = precisionRound(price, 2);
    let base = precisionRound(priceSet + ship, 2);
    let paypalPercent = precisionRound(2.9 / 100, 2);
    let paypalFee = precisionRound(.30, 2);
    let bonanzaFee = precisionRound(fee / 100, 2);
    let markup = precisionRound(mark / 100, 3);
    let costFee = precisionRound(paypalPercent * base + paypalFee, 2);
    let cost = precisionRound(costFee + base, 2);
    let markupPrice = precisionRound(cost * markup, 2);
    let basePrice = precisionRound(markupPrice + cost, 2);
    let basePricePayPal = precisionRound(basePrice * paypalPercent + paypalFee, 2);
    let basePriceBonaza = precisionRound(basePrice * bonanzaFee, 2);
    salePrice = precisionRound(basePrice + basePricePayPal + basePriceBonaza, 2);
    console.log(salePrice);
    return salePrice;
}

Meteor.methods({

    exportProducts() {
        let fields = [
            "id",
            "title",
            "description",
            "price",
            "images",
            "category",
            "shipping_price",
            "shipping_type",
            "sku",
            "qty",
            "trait",
            "force_update"
        ];

        let data = [];
        let products = Products.find({ category: { $exists: true } }).fetch();

        _.each(products, (c) => {

            let images = c.image_url + ', ' + c.additional_images

            data.push([
                c.sku,
                c.name,
                c.description,
                _calcPrice(c.cost_pro_member, c.shipping_cost, 6.45, 3.5),
                images,
                c.category,
                0,
                "free",
                c.sku,
                c.qty,
                c.trait,
                "true"
            ]);
        });

        return { fields: fields, data: data };
    },


    exportProductsEbid() {
        let fields = [
            "Username",
            "Category id",
            "Barcode",
            "Auction Title",
            "Image URL",
            "Item Condition",
            "Quantity",
            "Start",
            "End",
            "Starting Bid",
            "Feature",
            "BuyNow Price",
            "Brand",
            "Domestic Shipping",
            "International Shipping",
            "Payment Methods",
            "Auto Repost",
            "SKU",
            "Dispatch Time",
            "Return Policy",
            "Description",
            "Action",
            "End"
        ];

        let data = [];
        let products = Products.find({ category: { $exists: true } }).fetch();

        _.each(products, (c) => {
            let images = c.image_url + '##' + c.additional_images
            data.push([
                "aegisaccessories",
                c.category,
                c.upc ? c.upc : '',
                c.name,
                images,
                c.condition,
                c.qty,
                "Immediate",
                "run until sold",
                "",
                "gallery",
                _calcPrice(c.cost_pro_member, c.shipping_cost, 6.45, 2.0),
                c.manufacturer,
                "03=0.00",
                "01",
                5,
                0,
                c.sku,
                2,
                2,
                c.description,
                "ao",
                "##end##"
            ]);
        });

        return { fields: fields, data: data };
    },

    exportProductsEbidBrand(brand) {
        let fields = [
            "Username",
            "Category id",
            "eBid Store Category",
            "Barcode",
            "Auction Title",
            "Image URL",
            "Item Condition",
            "Quantity",
            "Start",
            "End",
            "Starting Bid",
            "Sales Tax",
            "Reserve",
            "Feature",
            "YouTube Video ID",
            "BuyNow Price",
            "Brand",
            "Domestic Shipping",
            "International Shipping",
            "Payment Methods",
            "Auto Repost",
            "SKU",
            "Dispatch Time",
            "Return Policy",
            "Description",
            "Action",
            "End"
        ];

        let data = [];
        let products = Products.find({ category: { $exists: true }, manufacturer: brand }).fetch();

        _.each(products, (c) => {
            let images = c.image_url + '##' + c.additional_images
            
            function category(cat){
                let category = cat;
                
                switch(category) {
                    case '9355': 
                        return '1282'
                        break;
                    case '111418':
                        return '19468'
                        break;
                    case '111422':
                        return '9590'
                        break;
                    case '171485':
                        return '16648'
                        break;
                    case '171485':
                        return '16648'
                        break;
                    default:
                        return '995'
                }
            }

            function condition(condition) {
                if(condition === "New") {
                    return "new"
                } else {
                    return "used"
                }
            }

            function description(product) {
                return product.description + 
                        "<br><br><b>Package Includes:</b> " + product.package_includes +
                        "<br><br><b>Condition Description:</b> " + product.condition_description +
                        "<br><br><b>Warranty Information:</b> " + product.warranty +
                        "<br><br><b>Return Policy:</b> " + product.return_policy;
            }
            data.push([
                "aegisaccessories",
                category(c.category),
                "",
                c.upc_code ? c.upc_code : '',
                c.name.substring(0, 80),
                images.replace(/,/gi, "##"),
                condition(c.condition),
                c.qty,
                "Immediate",
                "run until sold",
                "1.00",
                "",
                "",
                "Gallery",
                "",
                _calcPrice(c.cost_pro_member, c.shipping_cost, 6.45, 2.0),
                c.manufacturer,
                "03=0.00",
                "01",
                '5',
                '0',
                c.sku,
                '2',
                '2',
                description(c),
                "ao",
                "##end##"
            ]);
        });

        return { fields: fields, data: data };
    },

    removeAll() {
        Products.remove({});
    },

    parseUpload(data) {
        check(data, Array);
        for (let i = 0; i < data.length; i++) {
            let item = data[i];

            Products.insert(item);
            console.log('SKU: ' + item.sku + ' has been added to database.');
        }
    },

    parseBonanza(data) {
        check(data, Array);

        for (let i = 0; i < data.length; i++) {
            let item = data[i],
                exists = Products.findOne({ sku: item.sku });

            if (!exists) {
                console.warn('Rejected. This item does not exist.');
            } else {
                if (item.category !== null && item.traits !== null) {
                    console.log(item.category);
                    Products.update(exists._id, {
                        $set: {
                            'category': item.category,
                            'trait': item.trait
                        }
                    });
                    console.log('SKU: ' + item.sku + ' has been updated in database.');
                } else {
                    console.log('Item values not present.');

                }

            }
        }
    }
});