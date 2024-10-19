export class RecommendedPropertiesSchema {
  static schema = {
      name: 'RecommendedProperties',
      primaryKey: 'nid',
      properties: {
        nid: 'string', //primary key
        title: 'string?',
        url: 'string?',
        short_url: 'string?',
        new_launch: 'bool?',
        listing_type: 'string?',
        fair_value: 'string?',
        asking_price: 'string?',
        district: 'string?',
        street: 'string?',
        postcode: 'string?',
        bedrooms: 'int?',
        bathrooms: 'int?',
        property_type: 'string?',
        year_completed: 'string?',
        tenure: 'string?',
        land_area: 'string?',
        price_pu: 'string?',
        images: 'string?[]',
        timestamp: {type: 'int', default: new Date().getTime()}
    }
  }
}
