export default class RealmHelper {
  constructor() {
  }

  //realm query function
  WriteAll(realm, schema, results, primaryKey=""){
    try {
        realm.write(() => {
          if(Array.isArray(results)){
            for(var i = 0; i < results.length; i++){
              if(primaryKey.length > 0){
                var data = realm.objects(schema).filtered(primaryKey + '="' + results[i][primaryKey] + '"');
                if(this.isEmpty(data)){
                  realm.create(schema, results[i])
                }
                else{
                  realm.create(schema, {[primaryKey]: results[i][primaryKey], timestamp: Math.floor(Date.now() / 1000)}, true);
                }
              }
              else{
                realm.create(schema, results[i])
              }
            }
          }
          else{
            if(primaryKey.length > 0){
              if(this.isEmpty(data)){
                realm.create(schema, results)
              }
              else{
                realm.create(schema, {[primaryKey]: results[primaryKey], timestamp: Math.floor(Date.now() / 1000)}, true);
              }
            }
            else{
              realm.create(schema, results)
            }
          }

        })
    }
    catch (e) {
      console.log('[DEBUG] error:', e)
    }
  }

  ReadAll(realm, schema){
    try {
      return Array.from(realm.objects(schema))
    }
    catch (e) {
      console.log('[DEBUG] error:', e)
      return {}
    }
  }

  Read(realm, schema, filter){
    try {
      return Array.from(realm.objects(schema).filtered(filter))
    }
    catch (e) {
      console.log('[DEBUG] error:', e)
      return {}
    }
  }

  DeleteAll(realm, schema){
    try {
      if(this.CheckDataExist(realm, schema)){
        var obj = realm.objects(schema);
        realm.write(() => {
          realm.delete(obj); // Deletes all data
        })
      }
    }
    catch (e) {
      console.log('[DEBUG] error:', e)
    }
  }

  Delete(realm, schema, filter){
    try {
      var obj = realm.objects(schema).filtered(filter);
      realm.write(() => {
        realm.delete(obj); // Deletes all data
      })
    }
    catch (e){
      console.log('[DEBUG] error:', e)
    }
  }

  CheckDataExist(realm, schema){
    try {
      var data = Array.from(realm.objects(schema))
      if(!this.isEmpty(data)){
        return true;
      }else{
        return false;
      }
    }
    catch (e) {
      console.log('[DEBUG] error:', e)
      return false
    }
  }


  //none realm query function
  RealmToJson(data){
    if(!this.isEmpty(data)){
      data = JSON.parse(JSON.stringify(data));
    }
    return data;
  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  JSONObjectToJSONArray(data, object){
    for(var i = 0; i < data.length; i++){
      if(data[i][object] != undefined){
        data[i][object] = Object.keys(data[i][object]).map(
          function(k) {
            return data[i][object][k]
          }
        );

      }
    }
    return data;
  }

  ExcludeKey(key, data){
    if(!this.isEmpty(data)){
      data = data.filter(function (props) {
        delete props[key];
        return true;
      });
    }
    return data;
  }
}
