'use strict';

/**
 * @param err
 * @param req
 * @param res
 * @param next
 */
export default  (err,req,res,next) => {
  let error = {
    error:(typeof err==='object' && err.message) || err,
  };
  res.statusCode = (typeof err==='object' && err.status) || 500;
  res.statusMessage = (typeof err==='object' && err.statusMessage) || 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error) );
  res.end();
};