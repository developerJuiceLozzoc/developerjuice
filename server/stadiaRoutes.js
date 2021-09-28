const express = require("express");
var app  = express.Router();

const {
  mongoConnect,getAchvmntsByGameName,
  loginUser,updateDocumentsWithUserRecords,
  setFriendsList,loginUserEasy,getFeaturedGameLib,
  updateGameLibrary,getTrendingUpdates,updateMilestonesWithUserRecords,
  appendInfoToDocs,getMilestonesByGameName,getRandomMileAchieve
} = require("./mongoDAO.js")
const parser = require('body-parser');
const encode64 = require("base64url");


app.get("/leaderboards/:gameID",async function(req,res,next){

  const gameID = encode64.decode(req.params.gameID);
  getAchvmntsByGameName(gameID,function(docs){
    res.status(200).json(docs);
  });
});
app.get("/milestones/:gameID",async function(req,res,next){

  const gameID = encode64.decode(req.params.gameID);
  getMilestonesByGameName(gameID,function(docs){
    res.status(200).json(docs);
  });
});

app.get("/trending-updates",(req,res)=>{
  getTrendingUpdates(function(err,docs){
    var docids = {};
    if(err){
      res.status(300).end();
      return;
    }
    docs.forEach(function(update){
      docids[update.achievementID] = {};
    });
    appendInfoToDocs(docs,docids,function(err,ENCRICHEDdocs){
      if(err){
        res.status(300).end();
        return;
      }
      else{
        res.status(200).send(ENCRICHEDdocs);
      }

    })

  })
})


app.get("/GameLibrary",function(req,res){
  getFeaturedGameLib(function(data){
    if(!data){
      res.status(300).end();
    }
    else{
      res.status(200).json(data)
    }
  })
})
app.post("/library",function(req,res){
  updateGameLibrary(req.body,function(err){
    if(err){
      res.status(300).end();
    }
    else{
      res.status(201).send();
    }
  })
})

app.post("/updateStats",async function(req,res,next){

  if(req.query.name==="milestones"){
    console.log("upadating milestones");
    updateMilestonesWithUserRecords(req.body,req.body.user,function(err){
      if(err){
          console.log(err);
          res.status(300).send();
      }
      else{
        res.status(200).send();
      }
    });
  }
  else{
    console.log("updating achievments");
    updateDocumentsWithUserRecords(req.body,req.body.user,function(err){
      if(err){
        console.log(err);
        res.status(300).send();
      }
      else{
        res.status(200).send();
      }
    });
  }

});

app.post('/setFriendsList',function(req,res){
  setFriendsList(req.body,function(err){
    if(err){
        console.log(err);
        res.status(300).send();
    }
    else{
      res.status(200).send();
    }
  });

})
app.get("/login/refresh",function(req,res){
  // using the token they have. right now is username
  loginUserEasy(req.query.token,function(err,user){
    if(err){
      console.log(err);
      res.status(400).send("bad")
    }
    else{
      res.status(200).json(user)
    }
  })
})
app.post("/login",async function(req,res,next){

    loginUser(req.body,function(err,user){
      if(err){
        console.log(err);
        res.status(400).send("bad")
      }
      else{
        res.status(200).json(user)
      }
    });

});
app.get("/dashboard/random",function(req,res,next){

  getRandomMileAchieve(function(err,stats){
    if(err){
      console.log(err);
      res.status(400).send("bad")
    }
    else{
      console.log(stats);



      res.status(200).json(stats)
    }
  });
});
module.exports = app;
