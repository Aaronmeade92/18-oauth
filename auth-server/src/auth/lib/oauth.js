'use strict';

import superagent from 'superagent';

import User from '../model';

const authorize = (req) => {

  let code = req.query.code;

  console.log('(1) code', code);

  return superagent.post('https://www.googleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth`,
      grant_type: 'authorization_code',
    })
    .then( response => {
      let linkedToken = response.body.access_token;
      console.log('(2) linkedin token', linkedinToken);
      return linkedinToken;
    })
  // use the token to get a user
    .then ( token => {
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
        .set('Authorization', `Bearer ${token}`)
        .then (response => {
          let user = response.body;
          console.log('(3) linkedIn User', user);
          return user;
        });
    })
    .then(linkedinUser => {
      console.log('(4) Creating Account')
      return User.createFromOAuth(linkedinUser);
    })
    .then (user => {
      console.log('(5) Created User, generating token');
      return user.generateToken();
    })
    .catch(error=>error);
};



export default {authorize};