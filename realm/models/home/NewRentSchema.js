export class NewRentSchema {
  static schema = {
      name: 'NewRentSchema',
      primaryKey: 'property_id',
      properties: {
        property_id: 'int', //primary key
        nid: 'int',
        mid: 'int',
        title: 'string?',
        key: 'string?',
        uid: 'string?',
        listing_type: 'string?',
        asking_price: 'string?',
        street: 'string?',
        postcode: 'string?',
        bedrooms: 'int?',
        bathrooms: 'int?',
        year_completed: 'string?',
        tenure: 'string?',
        land_area: 'string?',
        images: 'string?[]',
        timestamp: {type: 'int', default: new Date().getTime()}
    }
  }
}
