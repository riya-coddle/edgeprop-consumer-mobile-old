export class NewsDetailSchema {
  static schema = {
      name: 'NewsDetail',
      primaryKey: 'nid',
      properties: {
          nid: 'string', //primary key
          title: 'string?',
          thumbnail: 'string?',
          path: 'string?',
          author: 'string?',
          //body: 'NewsBody[]',
          body: 'string?',
          created: 'string?',
          category: 'string?',
          source: 'string?',
          tags: 'string?[]',
          enable_registration: 'string?',
          author_id: 'string?',
          category_id: 'string?',
          timestamp: {type: 'int', default: new Date().getTime()}
      }
  }
}
