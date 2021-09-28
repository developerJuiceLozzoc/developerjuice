# project-directory-page-handlebars

In order to use this, First you ` SuperCoolProjects.js` javacsript file to reflect the content youd like to use, in order to import it into your app, something similar to the server.js (honestly dont copy paste server.js it wont work for you)

add this


```javascript
...
const ViewEngine = require("express-handlebars");
const {SuperCoolProjects,icons} =  require(<absolute path to project>+ "/project-directory-page-handlebars/SuperCoolProjects.js");

app.engine('handlebars', ViewEngine({
	helpers: {
		"geticon": function(name,options){
			return options.fn(icons[name])
		}
	}
}));
app.set('view engine', 'handlebars');


// its best to use the absolute path. for insance, my express server is a systemd start process, and
// node is executed in its /bin path. so when the terminal is running this it needs the full path.

//!important!
app.set("views",<absolute path to project> + "/project-directory-page-handlebars/views");

//i belive this will fix everything, because views is the top level folder, and all the corresponding folders are referenced in relation to viewss


...
..
// i am refereing to the file AppsDirectory.handlebars
// and using the json in the options
res.render("AppsDirectory",{
    layout:false,
    SuperCoolProjects
});


```

# Why would i use this?

Well if you have a web porfolio and you are in control of the server that serves the content, then you may also want to show off cool things you have created. this server-side rendering solution is also optimal to get the word out about your stuff to google crawlers


## it also is deployed right now

You can see for your self at www.developerjuice.xyz/freeapps/ visit and tweet your replies to my twitter mentioned over there as well.
