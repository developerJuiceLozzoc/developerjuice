

const SuperCoolProjects = [
    { title: `Sample Imaginary Project`,
    desc: `This is a where a description would be if this was a real project.
          This page is actually powered by an express-handlebars view engine and is rendered
          when requested. I learned to use handlebars in cs290`,
    thumb: { url: `https://placekitten.com/480/480`, alt: `a pretty kitty kat`},
    hindsight: `I had a fun time working with handlebars for this small project.
        All the css I wrote on my own, im not sure how i could use material-ui or something
        with this, even though I took a small dip in server side languages.`,
    link: `#`,
    cuteicons:[{name: "handlebars"}],
  },
  {
  title: `MarryKissKill`,
  desc: `This long known classic middle school stupid game is known by all
        genders. Which is why its an all gender nameless Mkk game. Each round
        you will see a rich 3d like experience where you tittylate your mind
        thinking about the possibilities. Future of this project is hopefully
        a crowsourcing of gender identification. All these anwers are what people think
        and do not reflect the truth`,
  thumb: { url: `https://placekitten.com/69/69`, alt: `What is this kats gender? would  you pet it or take it home?`},
  hindsight: `I used css keyframes to emulate 3d rotation. i also created
              a animated threejs.org rotation as well, one was faster b/c my 3js
              was suboptimal i think. but anyways it was fun. i also learned
              about web crawlers. spider py library, eventually i need to crwod
              source the genders, thatd be interesting wierd stuff.`,
  link: `#mkk-to-be-announced`,
  cuteicons:[{name: "pepe"},{name: "spice"}],
  },
  {
  title: `Piazza Archiver`,
  desc: `Piazza is a great discussion tool for classes in general for general
        questions, instructors rather answer questions in their hours but
        students often can answer students. Every quarter or semester the class
        gets created again though which is cray cray. using this system
        you can store all previous questions, but still also revist archives stuff
        in piazza.`,
  thumb: { url: `https://placekitten.com/404/404`, alt: `its like a faq, except its read only`},
  hindsight: `I could learn about the piazza api, and also maintain students privacy
  by taking on this challenge. It would be interesting linking articles easy and fast
  with the stuff.`,
  link: `#to-be-announced`,
  cuteicons:[{name: "handlebars"},{name: "react"},{name: "emotionjs"}],
  },

    {
      title: `Google Stadia UserJSON`,
      desc: ` Are you an egg hunter? do you like looking at leaderboards? well
          look no further. Here you can browse through an entire aggregated set of
           games data across global leaderboards!.`,
      thumb: { url: `https://i.imgur.com/cPTNcad.png`, alt: `Upload your JSON files here to find your spot on the leaderboards!`},
      hindsight: `I learned a lot about google firebase serverless.
            It was weird writing code that isnt in a server, but just as client side js,
            i guess thats fine if the data is stored somewhere else. I also leared about
            firebase Database, firebase authentication. pretty sweet, i couldnt use react
            google login, i had to use firebase google login.`,
      link: `gamerstats/`,
      cuteicons:[{name: "emotionjs"},{name: "react"}]
    },
    {
    title: `Poke Commenter`,
    desc: `You like pokemon animals or even live action wildlife? Well comment
          away on this application. Browse trending/recent/random pokemon comments
          and reply, no upvotes, no favorites, if you want to look back on it,
          you will have to reply.`,
    thumb: { url: `https://placekitten.com/100/100`, alt: `track comments and pokemon`},
    hindsight: `Be a very fun reactjs application. and i could have
                a lot of fun developing this in a team with other people`,
    link: `#to-be-announced`,
    cuteicons:[{name: "pepe"},{name: "react"},{name: "emotionjs"}],
    },
    {
    title: `Leading Prefix routing simulator`,
    desc: ` You ever wonder how tcp/udp packets are sent from router to router
       in an internet conversation? they use a switch with prefix matchers to quickly
       guide packed to a destinatio n within a mesh network. `,
    thumb: { url: `https://i.imgur.com/1rLbOw1.png`, alt: `Watch this educational animation on routing!`},
    hindsight: `Tacocat`,
    link: `lp-routing/`,
    cuteicons:[{name: "redux"},{name: "react"}]
    },
    {
    title: `TTalk`,
    desc: ` Do you want a location based app where identity is not required? Here
      you can reap comments as well as participating in local trending topics!
      Be apart of the community! `,
    thumb: { url: `https://i.imgur.com/o6PRzxS.png`, alt: `Read up on community gossip anonymously here!`},
    hindsight: `Tacocat`,
    link: `ttalk/`,
    cuteicons:[{name: "react"},{name: "spice"},{name: "firebase"}],
  },
  {
  title: `Tacocats`,
  desc: `Tacocats`,
  thumb: { url: `http://cheezetees.com/wp-content/uploads/2018/01/tacocat_newthumb.png`, alt: `a pretty kitty kat`},
  hindsight: `Tacocat`,
  link: `#`,
  cuteicons:[{name: "pepe"},{name: "spice"}],
  }
]
const ICONS = {
  "react": {
    thumb: "https://www.tuannguyen.tech/wp-content/uploads/2019/01/react.png",
    alt: "Reactjs"
  },
  "redux": {
    thumb: "http://blog.js-republic.com/wp-content/uploads/2016/11/logo-redux.png",
    alt: "ReactxRedux"
  },
  "mongodb":{
      thumb: "https://serverdensity-wpengine.netdna-ssl.com/wp-content/themes/onecol/images/random/mongodb.png",
      alt: "MongoDB, a NoSQL database"
    },
  "firebase":{
    thumb: "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",
    alt: "Google Firebase"
  },
  "handlebars":{
    thumb: "https://avatars2.githubusercontent.com/u/7997161?v=3&s=200",
    alt: "handlebars is a great VIEW framework"
  },
  spice: {
    thumb: "https://media.gettyimages.com/photos/spilled-pepper-shaker-close-up-picture-id157612946?s=170667a",
    alt: "V Spicey"
  },
  pepe:{
    thumb: "https://i.stack.imgur.com/J4WJh.png",
    alt: "Senpai teachs many students"
  },
  emotionjs:{
    thumb:"https://cdn-images-1.medium.com/max/1600/1*p236DRigU2r56RfNuPhzuQ.png",
    alt: "Emotion is CSS in JS, makes programtic styling really easy and fun!"
  }

}

module.exports.icons = ICONS;

module.exports.SuperCoolProjects = SuperCoolProjects;
