var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = function(config, body){
  if(typeof config.send === 'undefined') return console.log('No settings for mail found in config file');
  var mail_opts = config.send;
  if(typeof mail_opts.server === 'undefined') return console.log('No server setting found');
  if(typeof mail_opts.login === 'undefined') return console.log('Login is required.')
  if(typeof mail_opts.to === 'undefined') return console.log('"to" field is missing in config file.');
  if(typeof mail_opts.password === 'undefined') mail_opts.password = '';
  if(typeof mail_opts.subject === 'undefined') mail_opts.subject = 'Postboy test mail '+(new Date()).toString();
  if(typeof mail_opts.from === 'undefined') mail_opts.password = '';
  if(typeof mail_opts.port === 'undefined') mail_opts.port = 25;

  var transport = nodemailer.createTransport(smtpTransport({
    host: mail_opts.server,
    port: mail_opts.port,
    auth: {
      user: mail_opts.login,
      pass: mail_opts.password
    }
  }));

  var mailOptions = {
    from: mail_opts.from,
    to: mail_opts.to,
    subject: mail_opts.subject,
    html: body
  };

  transport.sendMail(mailOptions, function(error, info){
    if (error) {
      return console.log(error);
    }
    console.log('Message sent', info);
  });

};