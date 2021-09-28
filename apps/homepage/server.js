

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

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
/**
 * shuffles and deals out 10 Additional cards. kind of.

 * @param {Int,Array,Object} a items An array containing the items.
 */
function Yank_n_Items(len, arr, map={}){

  // guarentees a unique data set.
  while(Object.keys(map).length <= len){
    index = Math.floor(Math.random() * (arr.length + 1));
    map[`${index}`] = true;
  }
  return map;
}

var ViewEngine = require('express-handlebars');
const express = require('express');
const PATH = require('path')
const PORT = process.env.PORT || 31005;
const {SuperCoolProjects,icons} =  require(__dirname + "/project-directory-page-handlebars/SuperCoolProjects.js");

var app = express();

app.engine('handlebars', ViewEngine({
	helpers: {
		"geticon": function(name,options){
			// hhaha this like one line of code is what brings the imported icons into the handlebars engine.
			return options.fn(icons[name])
		}
	},
	layoutsDir: "query"
}));
app.set('view engine', 'handlebars');
app.set("views",__dirname+ "/project-directory-page-handlebars/views");

/*
Normally you have toregister partials. but if your partials are marked
as filenames in the correct place, things become much better.

ViewEngine.registerPartial("PartialHead",htmlhead);
ViewEngine.registerPartial("PartialShowCaseDetailed",htmldetailedcard);
ViewEngine.registerPartial("PartialFooter",htmlfooter);
const MySuperCoolPWADirectory = ViewEngine.compile()

*/

app.get("/",function(req,res,next){

	// render this page from /views and include this entire j
	// json object as you go through it
	//Super Cool UX i shuffle the list.
	res.status(200).render("AppsDirectory",{
		layout:false,
		SuperCoolProjects: shuffle(SuperCoolProjects)
	});

});


app.listen(PORT,function(err){

	if(err){
		console.log(err);
	}
	else{
		console.log("\n\t\t---Fin---\n");
	}
});
