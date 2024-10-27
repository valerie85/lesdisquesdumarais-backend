var express = require('express');
var router = express.Router();

//code pour connecter l'API Discogs
const CONSUMER_KEY=process.env.CONSUMER_KEY
const CONSUMER_SECRET=process.env.CONSUMER_SECRET

var Discogs = require('disconnect').Client;
var dis = new Discogs('MyUserAgentSonicmoon', {
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET});

var db = new Discogs().database();

//visu de la recherche d'une release
/*db.getRelease(176126, function(err, data){
	console.log(data);
});
*/

//code pour connecter la base swamprecords
const mongoose = require('mongoose');
require('../models/connection');
const Article = require('../models/articles');

/*
//commenté car ne fonctionne pas avec le complément de données
const saveArticlesToDatabase = async (jsonData) => {
  // filtre et formate le fichier json
  const articlesToSave = jsonData.map(item => ({
    release_id:item.release_id,
    artist: item.artist,
    title: item.title,
    genre: item.genre || null,  // il y a pas de genre sur le fichier
    style :item.genre || null,  // il y a pas de genre sur le fichier
    label: item.label,
    format: item.format,
    price: item.price ? item.price.toString() : null,
    weight: item.weight,
    comments: item.comments || "",
    year: item.listed ? new Date(item.listed).getFullYear().toString() : null,
    media_condition: item.media_condition || "",
    sleeve_condition: item.sleeve_condition || "",
    tracklist: item.tracklist || [],
    createdAt: item.listed ? new Date(item.listed) : Date.now(),
    selling_Date: '',
    isArchived: false,  // false par défaut
    isSold: false,  // false par défaut
    pictures: item.pictures || []  // vide
  }));

  try {
    await Article.insertMany(articlesToSave);
    console.log('Article sauvegardé');
  } catch (error) {
    console.error('Erreur :', error);
  }
};
*/
const insertArticle =async (item)=> {
  const articleToSave = new Article ({
   release_id:item.release_id,
   artist: item.artist,
   title: item.title,
   genre: item.genre || null,  // il y a pas de genre sur le fichier
   style :item.genre || null,  // il y a pas de genre sur le fichier
   label: item.label,
   format: item.format,
   price: item.price ? item.price.toString() : null,
   weight: item.weight,
   comments: item.comments || "",
   year: item.year || null,
    media_condition: item.media_condition || "",
    sleeve_condition: item.sleeve_condition || "",
    tracklist: item.tracklist || [],
    createdAt: item.listed ? new Date(item.listed) : Date.now(),
   selling_Date: '',
   isArchived: false,  // false par défaut
   isSold: false,  // false par défaut
   pictures: item.pictures || []  // vide
});
  articleToSave.save().then(()=> {
     console.log('Article sauvegardé');
  });
 
};

const fs = require('fs');

// lire le fichier json
//const newData = JSON.parse(fs.readFileSync('./article.json', 'utf8'))
const picturesToSave=[
  {release_id:7066010, pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/o6hmt86kddjjbyktzvpk',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/rezluaqfkze6ejfqheld',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/bqadsjfowi7ekl2tdetv']
  },
  {release_id:5657300, pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/kc1pe36v3byytmv8qed2',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/nplc7r4ehle8yw559dpk',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/atam9cwdyrfibv9n4bpw']
  },
  {release_id:3340975, pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/dmffxyc6i1umgnfsxixg',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/pn6aexob8uegobrmwps2',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/w0yaoyzuxrtweyx0s4s2']
  },
  {release_id:7670298 , pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/tuudvbytp0vu0nmhcaz1',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/rowoaluo4cgjcoe7hupk',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/ygznmk6pemflw9cfkowk',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/wozgpkmbnqwubwlmdxez' ,
   'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/nvpd0bu5f75puspbrv6p']
  },
  {release_id:8629191 ,pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/goqkfstjmyouz7mj0tij',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/wv3cm98dgktfqaaly9fd',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/dkjmirzwaczo49av5czh',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/zqtu2onbcceyyuj4lfiq' ,
   'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/baw7hqxhu3yioxwvilg1']
  },
  {release_id:2349118 ,pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/ovgufrussw0vfspcllwj',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/abw2bhihnwxukhtt9phi',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/ueqmhem0scnamouk7304',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/tjwbaq0hwmhorvmipwpp' ,
   'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/oua5czqpbn8rzgrzsyvg' ,
   'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/ukvd5ivybzwkphyx0jos',
   'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/yohgfpw5fbx5vzstepyv']
  },
  {release_id:3146116 ,pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/ig7rxrttupwi16gjxarv',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/sdcpadziskheu4es0h82',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/dzkuv8eynyjjcjrq5rqz',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/znwxqa3fokjh4bcopkj5']
  },
  {release_id:28915417 ,pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/os84i0m3mp7d9vikuswb',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/puyuzpiy8iamt4n1lfcx',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/yfupk1br0lbwakirdflf']
  },
  {release_id:29990083 ,pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/ws0lweko7z5qukm3epjx',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/u8gjuv9n1qj1syioaiho',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/yheavgodq9yy1e2gdmyp']
  },
  {release_id:3556482 ,pictures : [
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/plk3nugrberghst80vpe',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/ii3u4wedxsru8c1xjocz',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/augquc7tscscmglwlw0g',
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/qcthjlsbt6x26inusmls' ,
   'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/tnstb92mdkkgejttdknd' ,
  'https://res.cloudinary.com/du1anmu9i/image/upload/f_auto,q_auto/cmajytkr8iyemdfowi8b']
  }]

let completeData={};
//récupérer les données qui ne sont pas dans l'export (genres, styles, tracklist) en plusieurs fois sinon l'API bloque :( à investiguer !
const compData=(newData)=> {
  for(let i=0; i<newData.length; i++){
    db.getRelease(newData[i].release_id, function(err, data){
      if(data) {
        completeData=newData[i];
        completeData.genre=data.genres;
        completeData.style=data.styles;
        completeData.tracklist=data.tracklist;
        completeData.year=data.year;
        console.log(picturesToSave.some(e => e.release_id === newData[i].release_id));
        if(picturesToSave.some(e => e.release_id === newData[i].release_id)) {
          let pic=picturesToSave.filter(e=> e.release_id===newData[i].release_id);
          completeData.pictures=pic[0].pictures;
         }
        insertArticle(completeData);
        
         } else {
        console.log('missing data', err);
      }
    })
  };
};

//compData(newData); //appel pour compléter et sauver dans la DB à laisser commenté
// appel pour save
// pour utilise du decommente la ligne saveArticlesToDatabase(data);
//tu lance nodemon ou yarn start avec ta base de connecter
//saveArticlesToDatabase(completeData);

//Complément à la base pour les photos


module.exports = router; 