const dbConnection = require('../utils/database') ;
const dbRepository = require('../data/DbRepository') ;
const logger = require('../middleware/logging') ;


exports.getMenuNameData = async ()=>{
  /* This function returns the name of all menuItems, sizes, addonGroups, addonItems
   * in an object form. This is done so that we don't have to make a db request when parsing each item, or order
   * With this approach, we make request one time, and we parse the cart for all the orders.
   *
   * So for menuItems, we return a object(basically acts like a map)
   * itemNameData ={
        '41001': 'Margherito',
        '41002': 'Double Cheese ',
        '41003': 'Country Special',
      }
   * All the ids basically then act as keys.
   * To get the name of an item we do   itemNameData.itemId
   * We do the same thing for all sizes and addonGroups, addonItems.
   */
  try {
    let dbItemData = await dbRepository.getAllMenuItems_NameOnly();
    if (dbItemData.status != true) {
      throw dbItemData;
    }

    let dbSizeData = await dbRepository.getAllSizes_NamesOnly();
    if (dbSizeData.status != true) {
      throw dbSizeData;
    }

    let dbAddonGroupData = await dbRepository.getAllAddonGroups_NamesOnly();
    if (dbSizeData.status != true) {
      throw dbSizeData;
    }

    let dbAddonItemsData = await dbRepository.getAllAddonItems_NamesOnly();
    if (dbSizeData.status != true) {
      throw dbSizeData;
    }

    let itemNameData = {}, sizeNameData = {}, addonGroupNameData = {}, addonItemNameData = {};

    dbItemData.data.forEach((element, index) => {
      itemNameData[element.item_id] = element.item_name;
    });

    dbSizeData.data.forEach((element, index) => {
      sizeNameData[element.size_id] = element.size_name;
    });

    dbAddonGroupData.data.forEach((element, index) => {
      addonGroupNameData[element.rel_id] = element.addon_group_display_name;
    });

    dbAddonItemsData.data.forEach((element, index) => {
      addonItemNameData[element.item_id] = element.item_name;
    });

    return {
      status : true,
      itemNameData,
      sizeNameData,
      addonGroupNameData,
      addonItemNameData
    } ;

  }catch (e) {
    logger.error(`{'error' : '${JSON.stringify(e)}', 'at':'order_parse_utils.js / getMenuNameData() '}`) ;
    return {
      status : false,
      e
    } ;
  }
} ;

exports.parseCartFromBackendToAdminOrder = (menuNameData, cart)=>{
  /* This function parses the cart from the database cart to a descriptive string seen in the orders panel
   *
   * Input => [
      {
        "item_id":41006,
        "item_size_id":3,
        "item_quantity":3,
        "item_addon":[
          {"addon_group_id":1,"addon_items_array":[48005,48006]},
          {"addon_group_id":2,"addon_items_array":[]}
        ]
      },
      {...},
      {...}
    ]
   *
   * Output => an array of strings
   *
   *    ItemName (itemSize)
   *    addongroup1 : addonItem1, addonItem2
   *    addonGroup2 : addonItem3, addonItem4
   *
   *    ItemName (itemSize)
   *    addongroup1 : addonItem1, addonItem2
   *    addonGroup2 : addonItem3, addonItem4
   *
   *    ItemName (itemSize)
   *    addongroup1 : addonItem1, addonItem2
   *    addonGroup2 : addonItem3, addonItem4
   *
   */
  let arrayOfStrings = [] ;
  cart.forEach((element)=>{
    let descriptionString = '' ;
    let itemName = menuNameData.itemNameData[element.item_id] ;
    let sizeName = menuNameData.sizeNameData[element.item_size_id] ;
    descriptionString += `${itemName} (${sizeName}) <br>` ;
    element.item_addon.forEach((addonGroupElement)=>{
      if(addonGroupElement.addon_items_array.length == 0){
        return ; // works like how 'continue' is used in a normal for loop. in forEach loop we return, instead on continue
      }
      let addonGroupName = menuNameData.addonGroupNameData[addonGroupElement.addon_group_id] ;
      descriptionString += ` ${addonGroupName} : ` ;
      addonGroupElement.addon_items_array.forEach((addonItemId)=>{
        let addonItemName = menuNameData.addonItemNameData[addonItemId] ;
        descriptionString += `${addonItemName}, ` ;
      }) ;
      descriptionString = descriptionString.slice(0, -2); //removing the last comma and its space
      descriptionString += ' <br> ' ;
    }) ;
    descriptionString += ' <br>  ' ;
    arrayOfStrings.push(descriptionString) ;
  }) ;

  return arrayOfStrings ;


} ;


