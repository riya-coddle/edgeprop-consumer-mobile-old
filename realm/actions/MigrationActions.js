var Realm = require('realm')
import { RecommendedPropertiesSchema } from '../../realm/models/home/RecommendedPropertiesSchema'
import { BelowValuationPropertiesSchema } from '../../realm/models/home/BelowValuationPropertiesSchema'
import { NewLaunchesSchema } from '../../realm/models/home/NewLaunchesSchema'
import RealmHelper from '../../realm/helpers/RealmHelper'

export default class MigrationActions {
  schemaVersion = 0
  constructor() {
      this.RealmHelper = new RealmHelper();
  }

  MigrateSchema(){
    const migratedRealm = new Realm({
      schema: [],
      schemaVersion: 0,
      deleteRealmIfMigrationNeeded: true
    });
    migratedRealm.close();
  }

  /*
  put these code in HomeActions to Migrate Old Schema to New Schema
  MigrationHomeSchema(){
    const schemas = [
      {schema: ..., schemaVersion: 1, migration: this.MigationFuction01 },
      {schema: ..., schemaVersion: 2, migration: this.MigationFuction12 },
    ]
    schemaIndex = Realm.schemaVersion(Realm.defaultPath);
    while (schemaIndex < schemas.length) {
      const migratedRealm = new Realm(schemas[schemaIndex++]);
      migratedRealm.close();
    }
  }
  */

}
