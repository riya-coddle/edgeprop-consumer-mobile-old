var Realm = require('realm')
import { EditorPickSchema } from '../../realm/models/news/EditorPickSchema'
import { LatestNewsSchema } from '../../realm/models/news/LatestNewsSchema'
import { CategoryNewsSchema } from '../../realm/models/news/CategoryNewsSchema'
import RealmHelper from '../../realm/helpers/RealmHelper'
import MigrationActions from './MigrationActions'

export default class NewsActions {
  constructor() {
      this.RealmHelper = new RealmHelper();
      this.MigrationActions = new MigrationActions();
      this.EditorPickSchema = 'EditorPickSchema';
      this.LatestNewsSchema = 'LatestNews';
      this.CategoryNewsSchema = 'CategoryNews';
  }

  //common
  OpenRealmSchema(){
    this.realm = new Realm({
      schema: [EditorPickSchema,LatestNewsSchema,CategoryNewsSchema],
      schemaVersion: this.MigrationActions.schemaVersion
    })
  }

  CloseRealmSchema(){
    this.realm.close();
  }

  //news landing
  CreateEditorPickTopics(results) {
    this.OpenRealmSchema();
    this.RealmHelper.DeleteAll(this.realm, this.EditorPickSchema);
    this.RealmHelper.WriteAll(this.realm, this.EditorPickSchema, results, 'nid');
    this.CloseRealmSchema();
  }

  GetEditorPickTopics() {
    this.OpenRealmSchema();
    var EditorPick = this.RealmHelper.ReadAll(this.realm, this.EditorPickSchema);
    EditorPick = this.RealmHelper.RealmToJson(EditorPick);
    EditorPick = this.RealmHelper.ExcludeKey('timestamp',EditorPick)
    this.CloseRealmSchema();
    return EditorPick;
  }

  CreateLatestNews(results) {
    this.OpenRealmSchema();
    this.RealmHelper.DeleteAll(this.realm, this.LatestNewsSchema);
    this.RealmHelper.WriteAll(this.realm, this.LatestNewsSchema, results, 'nid');
    this.CloseRealmSchema();
  }

  GetLatestNews() {
    this.OpenRealmSchema();
    var LatestNews = this.RealmHelper.ReadAll(this.realm, this.LatestNewsSchema);
    LatestNews = this.RealmHelper.RealmToJson(LatestNews);
    LatestNews = this.RealmHelper.ExcludeKey('timestamp',LatestNews)
    this.CloseRealmSchema();
    return LatestNews;
  }

  //news category
  CreateCategoryNews(results, category) {
    this.OpenRealmSchema();
    this.RealmHelper.Delete(this.realm, this.CategoryNewsSchema, 'category_id = "' + category + '"');
    this.RealmHelper.WriteAll(this.realm, this.CategoryNewsSchema, results, 'nid');
    this.CloseRealmSchema();
  }

  GetCategoryNews(category) {
    this.OpenRealmSchema();
    var CategoryNews = this.RealmHelper.Read(this.realm, this.CategoryNewsSchema, 'category_id = "' + category + '"');
    CategoryNews = this.RealmHelper.RealmToJson(CategoryNews);
    CategoryNews = this.RealmHelper.ExcludeKey('timestamp',CategoryNews)
    this.CloseRealmSchema();
    return CategoryNews;
  }
}
