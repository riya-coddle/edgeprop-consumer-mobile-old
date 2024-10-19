export class NewLaunchesSchema {
  static schema = {
      name: 'NewLaunches',
      primaryKey: 'nid',
      properties: {
          nid: 'string', //primary key
          image: 'string?',
          thumbnail: 'string?',
          title: 'string?',
          developer: 'string?',
          district: 'string?',
          top_date: 'string?',
          category: 'string?',
          url: 'string?',
          timestamp: {type: 'int', default: new Date().getTime()}
      }
  }
}
