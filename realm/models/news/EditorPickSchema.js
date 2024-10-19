export class EditorPickSchema {
  static schema = {
      name: 'EditorPickSchema',
      primaryKey: 'nid',
      properties: {
          nid: 'string', //primary key
          featured: 'string?',
          url: 'string?',
          image_original: 'string?',
          image: 'string?',
          title: 'string?',
          publishdate: 'string?',
          desc: 'string?',
          timestamp: {type: 'int', default: new Date().getTime()}
      }
  }
}
