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
    agent.add(`初めまして！にゃん子っていうにゃ～。よろしくにゃ～。`);
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

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('food', food);
  intentMap.set('aisatsu', aisatsu);
  agent.handleRequest(intentMap);
});
