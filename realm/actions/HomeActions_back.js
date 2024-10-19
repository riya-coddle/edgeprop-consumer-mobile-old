var Realm = require('realm')
import { RecommendedPropertiesSchema } from '../../realm/models/home/RecommendedPropertiesSchema'
import { BelowValuationPropertiesSchema } from '../../realm/models/home/BelowValuationPropertiesSchema'
import { NewLaunchesSchema } from '../../realm/models/home/NewLaunchesSchema'
import RealmHelper from '../../realm/helpers/RealmHelper'
import MigrationActions from './MigrationActions'

export default class HomeActions {
    constructor() {
        this.RealmHelper = new RealmHelper();
        this.MigrationActions = new MigrationActions();
        this.NewLaunchesSchema = 'NewLaunches';
        this.RecommendedPropertiesSchema = 'RecommendedProperties';
        this.BelowValuationPropertiesSchema = 'BelowValuationProperties';

    }

    OpenRealmSchema(){
      this.realm = new Realm({
        schema: [NewLaunchesSchema, RecommendedPropertiesSchema, BelowValuationPropertiesSchema],
        schemaVersion: this.MigrationActions.schemaVersion
      });
    }

    CloseRealmSchema(){
      this.realm.close();
    }

    CreateNewLaunches(results) {
      this.OpenRealmSchema();
      this.RealmHelper.DeleteAll(this.realm, this.NewLaunchesSchema);
      this.RealmHelper.WriteAll(this.realm, this.NewLaunchesSchema, results, 'nid');
      this.CloseRealmSchema();
    }

    GetNewLaunches() {
      this.OpenRealmSchema();
      var NewLaunches = this.RealmHelper.ReadAll(this.realm, this.NewLaunchesSchema);
      NewLaunches = this.RealmHelper.RealmToJson(NewLaunches);
      NewLaunches = this.RealmHelper.ExcludeKey('timestamp',NewLaunches)
      this.CloseRealmSchema();
      return NewLaunches;
    }

    CreateRecommendedProperties(results){
      this.CreateTopPickProperties(this.RecommendedPropertiesSchema, results, 'nid');
    }

    CreateBelowValuationProperties(results){
      this.CreateTopPickProperties(this.BelowValuationPropertiesSchema, results, 'nid');
    }

    GetRecommendedProperties(){
      return this.GetTopPickProperties(this.RecommendedPropertiesSchema);
    }

    GetBelowValuationProperties(){
      return this.GetTopPickProperties(this.BelowValuationPropertiesSchema);
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
