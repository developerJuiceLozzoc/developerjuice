const mongoose       = require('mongoose'),
      autoIncrement  = require('mongoose-auto-increment'),
      _              = require("lodash");
// const mongodb = require("mongodb");
// mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/
const Schema = mongoose.Schema;
const {config} = require("./config.js");
// const update_table_maxsize = Math.pow(2,13);

//
// // use the native mongo create capped collection commands
// did this with the mongo cli
// mongodb.MongoClient.connect()
// .then((db)=>{
//   db.createCollection("game_stat_updates",{
//     capped:true,
//     size: update_table_maxsize,
//     max: 50
//   })
// })
//

const achieveSchema = new Schema({
  applicationName: String,
  achievementName: String,
  description:String,
  progress: [{name: String, prcnt: Number, when: Date}],
});

const milestonesSchema = new Schema({
  applicationName: { type: String, required: true },
  value:  [{name: String, amnt: Number, when: Date}],
  name: { type: String, required: false }
});


const updateSchema = new Schema({
  table: String,
  achievementID: mongoose.ObjectId,
  before: Number,
  current: Number,
  modifedOn: Date,
  author: String
});

const librarySchema = new Schema({
  "skuName": String,
  "skuDescription": String,
  "itemid": Date
})


const userSchema = new Schema({
  username: String,
  friends: [String],
  email : String,
});

const UpdatesTable = mongoose.model("game_stat_updates",updateSchema);
const Users = mongoose.model("users",userSchema);
const LibEntries = mongoose.model("game_titles",librarySchema);
const Achievments = mongoose.model('achvments',  achieveSchema);
const Milestone = mongoose.model("milstnes", milestonesSchema);
// progress will be the largest subcollection in each document.
// containing every users progress in that application
function mongoConnect(callback){
  mongoose.connect(config.mongodb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user:config.mongodb.user,
    pass:config.mongodb.pass,
    dbName: config.mongodb.dbname,
  },function(error) {
    if(error){
      console.log(error);
    }
    else{
      callback();
    }
  // Check error in initial connection. There is no 2nd param to the callback.
  });
}

/* trending updates is the last 2^13 bytes of updated  content. due the
bulk nature of updates, this basically just comprises of one users information.

maybe in the future users dont update their progess as much during each upload iteration
*/
function getTrendingUpdates(callback){
  // trending is a default amount that receives no arguments. for thepage.
  UpdatesTable
  .find({})
  .sort([['modifedOn', -1]])
  .exec(function(err,docs){
    if(err){
      console.log(err);
      callback(err,false);
    }
    else{
      // shuffle the docs?
      callback(false,docs);

    }
  })

}
exports.getTrendingUpdates = getTrendingUpdates;


/*
callback(err,stats)
on success it replies with
(0,{a,b})
on error
(err,0)
*/
function getRandomMileAchieve(callback){
  Achievments.aggregate([
    {$match: {}},
    {$sample: {size: 1}}
  ], function(err, a) {
      if(err){
        callback(err,0);
        return;
      }

      Milestone.aggregate([
          {$match: {}},
          {$sample: {size: 1}}
      ], function(err, b) {
          if(err){
            callback(err,0);
            return;
          }
            callback(0,{a,b});
            return;
        });

  });
    // here we get a random seed,

  //now we query both tables with the seed.


}

exports.getRandomMileAchieve = getRandomMileAchieve;

function getFeaturedGameLib(callback){


  LibEntries.find({},function(err,docs){
    if(err){
      console.log(err);
      callback(false)
    }
    else{
      callback(docs);
    }
  })
  LibEntries.countDocuments({},function(err,count){
    var featurearr=[]

    for(var i=0;i<20;i++){
      var index = Math.random()*100000 % count;
      featurearr.push(index);
    }

  })


}
exports.getFeaturedGameLib = getFeaturedGameLib;


const USERPROFILE = {
    "gamerTag": 1,
    "residenceCountryCode": 1,
    "privacySetting": {
      "presenceStatus": 1,
      "currentGame": 1,
      "gamesList": 1,
      "sendFriendInvite": 1,
      "friendsList": 1,
      "addViaEmail": 1,
      "multiplayerInvites": 1,
      "whoCanMessageYou": 1,
      "groupChatInvites": 1,
      "enableSharing": 1
    }
}


/*
callback takes two arguments:
(err,user)

*/
function loginUser(user,callback){
  var valid1,valid2;
  try{
    valid1 = Object.keys(USERPROFILE).reduce((accumulator,current)=>{
      return current && user[current];
    },true);
    valid2 = Object.keys(USERPROFILE.privacySetting).reduce((accumulator,current)=>{
      return current && user.privacySetting[current];
    },true);
  }
  catch(e){
    callback(e,null);
  }

 if(valid1 && valid2){
   Users.findOne({username: user.gamerTag},"username friends",function(err,doc){
     if(err){
       callback(err,err)
       return;
     }
     else if(!doc){
       new Users({
         username: user.gamerTag,
         privacySetting: user.privacySetting,
         friends: [],
         email: "",
       }).save(function(err){
         if(err){
           callback(err,null);
           return;
         }
         else{
           callback(null,{
             username: user.gamerTag,
             friends: []
           });
           return;
         }
       })
     }
     else{
       callback(null,doc);
       return;
     }
   })
 }
 else{
   callback(true,null);
 }
}
function loginUserEasy(user,callback){
  Users.findOne({username: user},"username friends",function(err,doc){
    if(err){
      callback(err,err)
      return;
    }
    else{
      // there will be no way this returns nothing since the user has already
      // logged in before.
      callback(null,doc);
      return;
    }
  })

}
function appendInfoToDocs(docs,lookup,callback){
  Milestone
  .find({ _id: {"$in" : Object.keys(lookup)}} )
  .exec(function(err,a){
    if(err){
    console.log(err);
    callback(err,docs);
    return;
    }
    else{
      Achievments
      .find({ _id: {"$in" : Object.keys(lookup)}} )
      .exec(function(err,b){
        if(err){
        console.log(err);
        callback(err,docs);
        return;
        }
        else{
          a.forEach(function(mile){
            lookup[mile.id] = { type: "Milestone", desc: mile.name, title: mile.applicationName}

          });
          b.forEach(function(achi){
            lookup[achi.id] = { type: "Achievment" , desc: achi.achievementName, title: achi.applicationName}

          });
          var enrichedflour = []
          docs.forEach(function(update){
              let ref = lookup[update.achievementID];
              enrichedflour.push({
                ...update._doc,
                game: ref.title,
                type: ref.type,
                desc: ref.desc
              })
            });
          callback(0,enrichedflour)

        }
      });
    }
  })

  return;
}

exports.appendInfoToDocs = appendInfoToDocs;

exports.loginUser = loginUser;
exports.loginUserEasy = loginUserEasy;


// when checking friends list and your own list
// you will sort clientside the document "progress"
function getAchvmntsByGameName(gameid,callback){
  Achievments.find({applicationName: gameid}, function (err, docs) {
    if(err){
      console.log(err);
      return;
    }
    else{
      callback(docs);
    }
  });
}


function createAchievments(user,docs){
  var newdocs = [];
  docs.forEach(function(value){
      value.progress = [{
        name: user,
        prcnt: parseFloat(value.progress),
        when: Date.now()
      }];
      newdocs.push(new Achievments(value));
  })
  Achievments.insertMany(newdocs,function(err){
    if(err){
      console.log("SOME DOCUMENTS FAILED TO WRITE",err);
    }
  })

}
function createMilestone(user,docs){
  var newdocs = [];
  docs.forEach(function(value){
    if(!value.value){
      // fucking exceptions in the gamer api.
      return;
    }
    else if(!parseFloat(value.value.replace(/,/g,''))){
      console.log(value.value);
      return;
    }
      value.value = [{
        name: user,
        amnt: parseFloat(value.value.replace(/,/g,'')),
        when: Date.now()
      }];
      newdocs.push(new Milestone(value));
  })
  Milestone.insertMany(newdocs,function(err){
    if(err){
      console.log("SOME DOCUMENTS FAILED TO WRITE",err);
    }
  })

}
function deepIndexOf(obj,arr){
  for(var i=0;i<arr.length;i++){
    if(!obj.achievementName){
      if(!arr[i].achievementName && arr[i].applicationName === obj.applicationName){
        return i;
      }
    }
    else if(arr[i].applicationName === obj.applicationName && arr[i].achievementName === obj.achievementName ){
      return i;
    }
  }
  return -1;
}

// noexport because its a private funciton.
function updateGameLibrary(gameids){
  LibEntries.find({
      skuName: { $in: gameids},
    }, function (err, docs) {
      if(err){
        console.log(err);
        return;
      }
      var newLibs = [];
      // now we need to filter the gameIds array with all the ones that we have.
      docs.forEach(function(val){
        var index = gameids.indexOf(val.skuName);
        if(index !==-1 ){
          delete gameids[index];
        }
      });

      for(let i =0;i<gameids.length;i++){
        if(gameids[i]){
          newLibs.push(
            new LibEntries({
              skuName: gameids[i],
              skuDescription: "",
              itemid: Date.now()+i
            })
          );
        }
      }
      console.log("Adding new  game Titles to the collection!",newLibs);
      LibEntries.insertMany(newLibs,function(err){
        if(err){
          console.log("SOME DOCUMENTS FAILED TO WRITE",err);
        }
      })

      return;
    });


}


/*
In this function we update a bulk about.
each achievementName

since this is also creatoin, it is seperated into two halfs.
first: find all existing achiemvents, then update them
as well as creating new documents.

Things that will be done with this function:
create/update achievments
create/update gamerstats
create new docs in the game_titles collection
**/
async function updateDocumentsWithUserRecords(gson,user,callback){
  var gameids =[];
  var updateIndexs=[];
  var updateArray=[];
  var createArray=[];


  gson.data.forEach(function(value){
    gameids.push(value.applicationName);
  });
  // only get the applicationNames
 gameids = _.uniq(gameids);

 updateGameLibrary(gameids); // spawn this process


  // kind of expensive.
  Achievments.find({
      applicationName: { $in: gameids},
    }, function (err, docs) {
      if(err){
        console.log(err);
        return;
      }
      console.log("===\n mongodb",docs.length,gson.data.length);
      // we keep track of all the indexes of the dbdoc to incoming gson.
      //eleminate the results that were returned from the list.
      docs = docs.filter(function(doc){
        var tempindex = deepIndexOf(doc,gson.data);
        if(tempindex === -1){
            return false;
        }
        else{
          updateIndexs.push(tempindex);
          return true;
        }
      });


      if(updateIndexs.length){
        gson.data.forEach(function(value,index){
          if(updateIndexs.includes(index)){
            updateArray.push(value);
            gson.data[index] = null;
          }
          else if(!value.achievementName){
            gson.data[index] = null;
          }

        })

      }
      gson.data.forEach(function(value){
        if(value){
          createArray.push(value)
        }
      });
      createAchievments(user,createArray);
      console.log("number of created achivements: ",createArray.length);

      var updateDocs = [];
      for(let update =0;update < docs.length; update++){
        var index = deepIndexOf(docs[update],updateArray);
        var progIndex = progressIndexOf(user,docs[update].progress);

        if(progIndex!==-1){
          var playersprogress = docs[update].progress[progIndex].prcnt;
            if(parseFloat(updateArray[index].progress) > playersprogress ){
              updateDocs.push({
                table: "ACHVMNT",
                modifedOn: Date.now(),
                achievementID: docs[update]._id,
                before:playersprogress,
                current: parseFloat(updateArray[index].progress),
                author: user,
                type: "update"
              })
            }
            else {
             continue;
            }
          }
          else{
            // if the author is adding his name to list for the first timeout
            // we use the -1 to signal that.
            // the player has this achivment, but its notin there.
            updateDocs.push({
              table: "ACHVMNT",
              modifedOn: Date.now(),
              achievementID: docs[update]._id,
              before: -1,
              current: parseFloat(updateArray[index].progress),
              author: user,
              type: "add"
            })
        }
      }

      console.log("achivements: updates: ", updateDocs.length);
      for(var update=0;update < updateDocs.length;update++){
        if(update.type === "update"){
          Achievments.updateOne({ _id:updateDocs[update].achievementID},
            { $set: {'progress.$[p].prcnt': updateDocs[update].current ,'progress.$[p].when': Date.now()} },
            {
              multi: false,
              arrayFilters: [ { "p.name": user } ]
            },
            function(err,doc){
              if(err){
                callback(err);
              }
            });
        }
        else{
          const progresItem = {
            name: updateDocs[update].author,
            prcnt: updateDocs[update].current ,
            when: Date.now()
          }
          Achievments.updateOne({ _id:updateDocs[update].achievementID},
            { $push: { 'progress': progresItem } },
            function(err,doc){
              if(err){
                callback(err);
              }
            });
        }

          // right now i test if
         var newUpdate = new UpdatesTable(updateDocs[update]);
         newUpdate.save(function (saveErr) {
            if (saveErr){
              callback(saveErr);
            }
          });

        }
    });

    // only callback at the very end.
    callback(false)

}
function mdeepIndexOf(obj,arr){
  for(var i=0;i<arr.length;i++){
    if(!obj.name){
      if(!arr[i].name && arr[i].applicationName === obj.applicationName){
        return i;
      }
    }
    else if(arr[i].name === obj.name && arr[i].achievementName === obj.achievementName ){
      return i;
    }
  }
  return -1;
}

function getMilestonesByGameName(name,callback){
  Milestone.find({applicationName: name},function(err,docs){
    if(err){
      console.log(err);
      callback([])
      return;
    }
    else{
      callback(docs);
      return;
    }
  })
}

exports.getMilestonesByGameName = getMilestonesByGameName;






async function updateMilestones(gson,user,callback){
  var gameids =[];
  var updateIndexs=[];
  var updateArray=[];
  var createArray=[];


  gson.data.forEach(function(value){
    gameids.push(value.applicationName);
  });
  // only get the applicationNames
 gameids = _.uniq(gameids);



  // kind of expensive.
  Milestone.find({
      applicationName: { $in: gameids},
    }, function (err, docs) {
      if(err){
        console.log(err);
        return;
      }
      console.log("===\n mongodb",docs.length,gson.data.length);
      // we keep track of all the indexes of the dbdoc to incoming gson.
      //eleminate the results that were returned from the list.
      docs = docs.filter(function(doc){
        var tempindex = mdeepIndexOf(doc,gson.data);
        if(tempindex === -1){
            return false;
        }
        else{
          updateIndexs.push(tempindex);
          return true;
        }
      });


      if(updateIndexs.length){
        gson.data.forEach(function(value,index){
          if(updateIndexs.includes(index)){
            updateArray.push(value);
            gson.data[index] = null;
          }
          else if(!value.name){
            gson.data[index] = null;
          }

        })

      }
      gson.data.forEach(function(value){
        if(value){
          createArray.push(value)
        }
      });
      createMilestone(user,createArray);
      console.log("number of created  Milestones: ",createArray.length);

      var updateDocs = [];
      for(let update =0;update < docs.length; update++){
        var index = mdeepIndexOf(docs[update],updateArray);
        var progIndex = progressIndexOf(user,docs[update].value);

        if(progIndex!==-1){
          const playersprogress = docs[update].value[progIndex].amnt;
          const newval = parseFloat(updateArray[index].value.replace(/,/g,''));
            if(newval > playersprogress ){

              updateDocs.push({
                modifedOn: Date.now(),
                table: "MLSTN",
                achievementID: docs[update]._id,
                before: playersprogress,
                current: newval,
                author: user,
                type: "update"
              })
            }
            else {
             continue;
            }
          }
          else{
            const newval = parseFloat(updateArray[index].value.replace(/,/g,''));

            // if the author is adding his name to list for the first timeout
            // we use the -1 to signal that.
            // the player has this achivment, but its notin there.
            updateDocs.push({
              table: "MLSTN",
              modifedOn: Date.now(),
              achievementID: docs[update]._id,
              before: -1,
              current: newval,
              author: user,
              type: "add"
            })
        }
      }

      console.log("Milestone updates: ", updateDocs.length);
      for(var update=0;update < updateDocs.length;update++){
        if(update.type === "update"){
          Milestone.updateOne({ _id:updateDocs[update].achievementID},
            { $set: {'value.$[p].amnt': updateDocs[update].current ,'value.$[p].when': Date.now()} },
            {
              multi: false,
              arrayFilters: [ { "p.name": user } ]
            },
            function(err,doc){
              if(err){
                callback(err);
              }
            });
        }
        else{
          const progresItem = {
            name: updateDocs[update].author,
            amnt: updateDocs[update].current ,
            when: Date.now()
          }
          Milestone.updateOne({ _id:updateDocs[update].achievementID},
            { $push: { 'value': progresItem } },
            function(err,doc){
              if(err){
                callback(err);
              }
            });
        }

          // right now i test if
         var newUpdate = new UpdatesTable(updateDocs[update]);
         newUpdate.save(function (saveErr) {
            if (saveErr){
              callback(saveErr);
            }
          });

        }
    });

    // only callback at the very end.
    callback(false)

}
function setFriendsList(gson,callback){
  if(gson.data && gson.user){


    Users.findOne({username: gson.user},function(err,doc){
      if(err){
        callback(err)
      }
      else{
        doc.friends = gson.data;
        doc.save(function(err){
          if(err){
            callback(err)
          }
          else{
            callback(false);
          }
        })
      }
    })

  }
  else{
    callback(false)
  }

}


function progressIndexOf(user,arr){
  for(var i =0;i<arr.length;i++){
    if(arr[i].name === user){
      return i;
    }
  }
  return -1;
}

exports.updateDocumentsWithUserRecords= updateDocumentsWithUserRecords;
exports.updateMilestonesWithUserRecords =updateMilestones;
exports.setFriendsList = setFriendsList;
exports.getAchvmntsByGameName = getAchvmntsByGameName;
exports.mongoConnect = mongoConnect;

