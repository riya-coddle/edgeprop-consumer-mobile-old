export class FeaturedTopicSchema {
  static schema = {
      name: 'FeaturedTopic',
      primaryKey: 'id',
      properties: {
          id: 'string', //primary key
          title: 'string?',
          image: 'string?',
          caption: 'string?',
          url: 'string?',
          timestamp: {type: 'int', default: new Date().getTime()}
      }
  }
}
