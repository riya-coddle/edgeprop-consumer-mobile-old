var Realm = require('realm')
//import { NewLaunchesSchema } from '../../realm/models/home/NewLaunchesSchema'
import { NewSaleSchema } from '../../realm/models/home/NewSaleSchema'
import { NewRentSchema } from '../../realm/models/home/NewRentSchema'
import RealmHelper from '../../realm/helpers/RealmHelper'
import MigrationActions from './MigrationActions'

export default class HomeActions {
    constructor() {
        this.RealmHelper = new RealmHelper();
        this.MigrationActions = new MigrationActions();
        this.NewRentSchema = 'NewRentSchema';
        this.NewSaleSchema = 'NewSaleSchema';
    }

    OpenRealmSchema(){
      this.realm = new Realm({
        schema: [NewRentSchema, NewSaleSchema],
        schemaVersion: this.MigrationActions.schemaVersion
      });
    }

    CloseRealmSchema(){
      this.realm.close();
    }

    CreateNewSaleProperties(results){
      this.CreateTopPickProperties(this.NewSaleSchema, results, 'property_id');
    }

    GetNewSaleProperties(){
      return this.GetTopPickProperties(this.NewSaleSchema);
    }

    CreateNewRentProperties(results){
      this.CreateTopPickProperties(this.NewRentSchema, results, 'property_id');
    }

    GetNewRentProperties(){
      return this.GetTopPickProperties(this.NewRentSchema);
    }

    //common function
    CreateTopPickProperties(schema, results, primaryKey){
      this.OpenRealmSchema();
      this.RealmHelper.DeleteAll(this.realm, schema);
      this.RealmHelper.WriteAll(this.realm, schema, results, primaryKey);
      this.CloseRealmSchema();
    }

    GetTopPickProperties(schema){
      this.OpenRealmSchema();
      var Properties = this.RealmHelper.ReadAll(this.realm, schema);
      Properties = this.RealmHelper.RealmToJson(Properties);
      Properties = this.RealmHelper.JSONObjectToJSONArray(Properties, 'images');
      Properties = this.RealmHelper.ExcludeKey('timestamp',Properties)
      this.CloseRealmSchema();
      return Properties;
    }

}
