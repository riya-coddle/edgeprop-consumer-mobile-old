var Realm = require('realm')
import { FeaturedTopicSchema } from '../../realm/models/news/FeaturedTopicSchema'
import { LatestNewsSchema } from '../../realm/models/news/LatestNewsSchema'
import { CategoryNewsSchema } from '../../realm/models/news/CategoryNewsSchema'
import { NewsDetailSchema } from '../../realm/models/news/NewsDetailSchema'
import { RelatedNewsSchema } from '../../realm/models/news/RelatedNewsSchema'
import RealmHelper from '../../realm/helpers/RealmHelper'
import MigrationActions from './MigrationActions'

export default class NewsActions {
  constructor() {
      this.RealmHelper = new RealmHelper();
      this.MigrationActions = new MigrationActions();
      this.FeaturedTopicSchema = 'FeaturedTopic';
      this.LatestNewsSchema = 'LatestNews';
      this.CategoryNewsSchema = 'CategoryNews';
      this.NewsDetailSchema = 'NewsDetail';
      this.RelatedNewsSchema = 'RelatedNews';
  }

  //common
  OpenRealmSchema(){
    this.realm = new Realm({
      schema: [FeaturedTopicSchema,LatestNewsSchema,CategoryNewsSchema,NewsDetailSchema,RelatedNewsSchema],
      schemaVersion: this.MigrationActions.schemaVersion
    })
  }

  CloseRealmSchema(){
    this.realm.close();
  }

  //news landing
  CreateFeaturedTopics(results) {
    this.OpenRealmSchema();
    this.RealmHelper.DeleteAll(this.realm, this.FeaturedTopicSchema);
    this.RealmHelper.WriteAll(this.realm, this.FeaturedTopicSchema, results, 'id');
    this.CloseRealmSchema();
  }

  GetFeaturedTopics() {
    this.OpenRealmSchema();
    var FeaturedTopics = this.RealmHelper.ReadAll(this.realm, this.FeaturedTopicSchema);
    FeaturedTopics = this.RealmHelper.RealmToJson(FeaturedTopics);
    FeaturedTopics = this.RealmHelper.ExcludeKey('timestamp',FeaturedTopics)
    this.CloseRealmSchema();
    return FeaturedTopics;
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

  //news detail
  CreateNewsDetail(results) {
    this.OpenRealmSchema();
    var data = JSON.parse(JSON.stringify(results));
    data.body = JSON.stringify(data.body);
    this.RealmHelper.Delete(this.realm, this.NewsDetailSchema, 'nid = "' + data.nid + '"');
    this.RealmHelper.WriteAll(this.realm, this.NewsDetailSchema, data, 'nid');
    this.CloseRealmSchema();
  }

  GetNewsDetail(nid){
    this.OpenRealmSchema();
    var NewsDetail = this.RealmHelper.Read(this.realm, this.NewsDetailSchema, 'nid = "' + nid + '"');
    NewsDetail = this.RealmHelper.RealmToJson(NewsDetail);
    NewsDetail = this.RealmHelper.ExcludeKey('timestamp',NewsDetail)
    this.CloseRealmSchema();
    if(NewsDetail[0]){
      NewsDetail[0].body = JSON.parse(NewsDetail[0].body);
      return NewsDetail[0];
    }
    else{
      return {};
    }

  }

  CreateRelatedNews(results, news_id){
    this.OpenRealmSchema();
    var data = JSON.parse(JSON.stringify(results));
    for(var i = 0; i < data.length; i++){
      data[i].news_id = news_id;
    }
    this.RealmHelper.Delete(this.realm, this.RelatedNewsSchema, 'news_id = "' + news_id + '"');
    this.RealmHelper.WriteAll(this.realm, this.RelatedNewsSchema, data, 'nid');
    this.CloseRealmSchema();
  }

  GetRelatedNews(news_id){
    this.OpenRealmSchema();
    var RelatedNews = this.RealmHelper.Read(this.realm, this.RelatedNewsSchema, 'news_id = "' + news_id + '"');
    RelatedNews = this.RealmHelper.RealmToJson(RelatedNews);
    RelatedNews = this.RealmHelper.ExcludeKey('timestamp',RelatedNews)
    this.CloseRealmSchema();
    return RelatedNews;
  }

}
