export class LatestNewsSchema {
  static schema = {
      name: 'LatestNews',
      primaryKey: 'nid',
      properties: {
          nid: 'string', //primary key
          title: 'string?',
          thumbnail: 'string?',
          path: 'string?',
          author: 'string?',
          created: 'string?',
          category: 'string?',
          source: 'string?',
          category_id: 'string?',
          timestamp: {type: 'int', default: new Date().getTime()}
      }
  }
}
