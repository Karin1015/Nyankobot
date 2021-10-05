'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const https = require('https');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`はじめましてにゃ！にゃん子って言うにゃ。よろしくにゃ～。`);
    agent.add(`あなたのお名前も教えてほしいにゃ。`);
  }
 
  function fallback(agent) {
    agent.add(`ごめんにゃ、分からないにゃ。`);
    agent.add(`他の言い回しで言えるかにゃ？`);
  }
  
  function aisatsu(agent) {
    let aisatsu = agent.parameters.aisatsu;
    agent.add(`${aisatsu}にゃ～`);
  }
  
  function food(agent) {
    let food = agent.parameters.food;
    agent.add(`にゃん子も${food}食べたいにゃ～`);
  }
  
  function tenki(agent) {
    return new Promise((resolve, reject) => {
        //httpのリクエストを送信
      	let location = agent.parameters.any;
        let req = https.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(location)}&appid=76c23c9c089cfa51d4df7dd0e8d7c360&lang=ja`, (res) => {
          let chunk = '';
          //読み込み中の処理
          res.on('data', (c) => {
            chunk += c;
          });
          
          //読み込み完了時の処理
          res.on('end', () => {
            let response = JSON.parse(chunk);
            console.log('response: ' + JSON.stringify(response));
            
            //パラメータの取得
            let weather = response.weather[0].description;
            
            //表示
            agent.add(`${location}の天気は、${weather}です`);
            
            //処理終了
            resolve();
          });
        });
        
        //エラー時の処理
        req.on('error', (e) => {
          console.error(`エラー： ${e.message}`);
        });
    });
    
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('food', food);
  intentMap.set('aisatsu', aisatsu);
  intentMap.set('tenki', tenki);
  agent.handleRequest(intentMap);
 
});
