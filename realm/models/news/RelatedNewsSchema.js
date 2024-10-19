export class RelatedNewsSchema {
  static schema = {
      name: 'RelatedNews',
      primaryKey: 'nid',
      properties: {
          nid: 'string', //primary key
          title: 'string?',
          thumbnail: 'string?',
          path: 'string?',
          author: 'string?',
          created: 'string?',
          category: 'string?',
          category_id: 'string?',
          news_id: 'string',
          timestamp: {type: 'int', default: new Date().getTime()}
      }
  }
}
