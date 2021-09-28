const express = require('express')
const path = require('path')
const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');
var firebase = require('firebase/app');
const parser = require("body-parser");
const axios = require("axios");
require("firebase/firestore")
const serviceAccount = require("./jwt-private-config.json");
var ViewEngine = require("express-handlebars");

const {SuperCoolProjects,icons} =  require("../project-directory-page-handlebars/json/SuperCoolProjects.js");
const {Heads} =  require("../project-directory-page-handlebars/json/HtmlHeads.js");
const {mongoConnect} = require("./mongoDAO.js");
const stadiaRoutes = require("./stadiaRoutes.js");

var app = express();

app.use(parser.json());
app.engine('handlebars', ViewEngine({
	helpers: {
		"geticon": function(name,options){
			return options.fn(icons[name])
		},
   		 "EncodeTags": function(tags,options){
     			 return tags.join(" ")
    		}
	}
}));
app.set('view engine', 'handlebars');
app.set("views","/home/pi/Documents/code/developerjuice/project-directory-page-handlebars/views");

app.get("/icons/:path",function(req,res,next){
	res.sendFile(`/home/pi/Documents/code/developerjuice/project-directory-page-handlebars/static/icons/${req.params.path}`);
})
/**
 * Using keys and values we have a unique array of items with len more added.
 * @param {Arry,Number,Object} a items An array containing the items.
 *
 */
function union_n_more_items(arr,len,map={}){

	while(Object.keys(map).length <= len){
		map[`${Math.floor(Math.random() * (len + 1))}`] = true;
	}
	return map;
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

const firebaseConfig = {
  apiKey: "AIzaSyDz2P1y8G0eYTdiTxB4UREzXRCVzBIDfak",
  authDomain: "ttalk-48788.firebaseapp.com",
  databaseURL: "https://ttalk-48788.firebaseio.com",
  projectId: "ttalk-48788",
  storageBucket: "ttalk-48788.appspot.com",
  messagingSenderId: "267434987483",
  appId: "1:267434987483:web:bbf34377ff74bf059ae1fe",
  measurementId: "G-TPTERTEHZL"
};
// json private key is the


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ttalk-48788.firebaseio.com"
});


const firestore = firebase.initializeApp(firebaseConfig).firestore();

var ref = admin.database().ref("profile");

app.get("/apps/",(req,res,next)=>{

	res.status(200).render("AppsDirectory",{
		layout:false,
		SuperCoolProjects: shuffle(SuperCoolProjects),
                Head: Heads["appsdirectory"],

	});
});

app.get("/", async function(req,res,next){
  const CAROUSEL_LEN=1;
  var mems = [];

for(let i=0;i<CAROUSEL_LEN;i++){
        let obj = {

        };
            var resp = await axios.get("https://imgflip.com/i");
                if(resp.request._redirectable._currentUrl.indexOf("/i/") > 0){
                          obj.url = `https://i.imgflip.com/${resp.request._redirectable._currentUrl.split("/i/")[1]}.jpg`;
                                obj.alt = "Enjoy this great meme from https://imgflip.com"
                                      obj.id = resp.request._redirectable._currentUrl.split("/i/")[1]

                }
                    else if(resp.request._redirectable._currentUrl.indexOf("/gif/") > 0){
                              obj.url = `https://imgflip.com/gif/${resp.request._redirectable._currentUrl.split("/gif/")[1]}`;
                                    obj.alt = "Enjoy this great reaction gif from https://imgflip.com"
                                          obj.id = resp.request._redirectable._currentUrl.split("/gif/")[1]
                    }
         mems.push(obj)

}


  // render this page from /views and include this entire j
	// json object as you go through it
	//Super Cool UX i shuffle the list.
	res.status(200).render("HomePage",{
		layout:false,
		Head: Heads["homepage"],
    imgflipurls: mems
	});

});

/* hardcoded route, api must do user pass authenticate then pass
json to client */
app.post("/apps/ttalk/api/login",function(req,res){


  firestore.collection("profile")
  .where("username","==","anon") // hardcoded rn
  .get()
  .then(function(doc){
    var user,id;
    doc.forEach(function(doc){
      id =doc.id;
      user = doc.data();

    });
    const public = {
      id: id,
      ReportCommissioned:   user.ReportCommissioned,
      username: user.username,
      locations: user.locations,
    }
    admin.auth().createCustomToken(id, public)
    .then(function(customToken) {
      res.status(200).send(JSON.stringify({jwt: customToken}));
      // Send token back to client
    })
    .catch(function(error) {
      console.log('Error creating custom token:', error);
    });
  })
  .catch(function(err){
    console.log(err);
  })




});



app.use("/api/STADIAUI",stadiaRoutes);

app.use("/apps/ttalk",express.static(path.join(__dirname,"../apps/ttalk")));
app.use("/apps/gamerstats",express.static(path.join(__dirname,"../apps/stadia")));

app.use("/apps/lp-routing",express.static(path.join(__dirname,"../apps/routingsim")));


app.get("/apps/ttalk/*",(req,res)=>{
  res.status(200).sendFile(path.join(__dirname,"../apps/ttalk/index.html"));
})

app.get("/apps/gamerstats/*",(req,res)=>{
  res.status(200).sendFile(path.join(__dirname,"../apps/stadia/index.html"));
})


mongoConnect(function(){
  app.listen(31500,function(err){
    if(err){
    console.log(err);}
    else{
      console.log("server listening on 3333",process.env.PORT);
    }
  })

})
