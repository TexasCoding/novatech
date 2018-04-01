import Categories from './api/categories';
import EbidCategories from './api/ebidCategories';

const productFunctions = {
  bonazaCategory (category) {
    const catArray = category.split(' > ');

    const categoryName = Categories.findOne({ full_name: { $regex: catArray[1] } });

    if (categoryName) {
      return categoryName.category_id;
    }
    return 0;
  },

  ebidCategory (category) {
    const catArray = category.split(' > ');

    const categoryName = EbidCategories.findOne({ full_name: { $regex: catArray[1] } });

    if (categoryName) {
      return categoryName.category_id;
    }
    return 0;
  },

  precisionRound (number, precision) {
    const factor = 10 ** precision;
    return Math.round(number * factor) / factor;
  },

  calcPrice (price, shipping, mark, fee) {
    const ship = this.precisionRound(shipping + 0.81, 2);
    const priceSet = this.precisionRound(price, 2);
    const base = this.precisionRound(priceSet + ship, 2);
    const paypalPercent = this.precisionRound(2.9 / 100, 2);
    const paypalFee = this.precisionRound(0.30, 2);
    const bonanzaFee = this.precisionRound(fee / 100, 2);
    const markup = this.precisionRound(mark / 100, 3);
    const costFee = this.precisionRound((paypalPercent * base) + paypalFee, 2);
    const cost = this.precisionRound(costFee + base, 2);
    const markupPrice = this.precisionRound(cost * markup, 2);
    const basePrice = this.precisionRound(markupPrice + cost, 2);
    const basePricePayPal = this.precisionRound((basePrice * paypalPercent) + paypalFee, 2);
    const basePriceBonaza = this.precisionRound(basePrice * bonanzaFee, 2);
    return this.precisionRound(basePrice + basePricePayPal + basePriceBonaza, 2);
  },

  title (name, mpn) {
    const mpnLength = mpn.length;
    const title = name.substring(0, 80 - (mpnLength + 1));
    return `${title} ${mpn}`;
  },

  fullDescription (name, desc, includes, condDesc, warranty, returnPolicy) {
    return `<h2>${name}</h2>${desc}<br><br><b>Package Includes:</b> ${includes}<br><br><b>Condition Description:</b> ${condDesc.replace(/,/g, '&#44;')}<br><br><b>Warranty Information:</b> ${warranty.replace(/,/g, '&#44;')}<br><br><b>Return Policy:</b> ${returnPolicy.replace(/,/g, '&#44;')}<br>`;
  },

  traits (manufacturer, condition, mpn, upcCode) {
    if (upcCode !== 'na') {
      return `[[brand: ${manufacturer} ]] [[condition: ${condition} ]] [[mpn: ${mpn} ]] [[upc: ${upcCode} ]]`;
    }
    return `[[brand: ${manufacturer} ]] [[condition: ${condition} ]] [[mpn: ${mpn} ]]`;
  },

};

export default productFunctions;

