var express = require('express');
var app = express();

var schema = require('./schema');
var mongoose = require('mongoose');
var db_url = process.env.MONGODB_URI || "mongodb://localhost:27017/referrals";

var mailer = require('nodemailer');
var transporter = mailer.createTransport('smtps://gigstermailing%40gmail.com:commonkey@smtp.gmail.com');

mongoose.connect(db_url, function(err) {
	if (err) {
		console.log("Could not connect to MongoDB.");
		throw err;
	} else {
		console.log("MongoDB connection established");
	}
});

app.get('/', function(req, res) {
	res.sendStatus(200); 	// Used to check for health
});

app.post('/create/:inviter/:invitee', function(req, res) {
	invite_data = {inviter: req.params.inviter, invitee: req.params.invitee, accepted: false};
	if (req.params.invitee.indexOf("@") > -1) {
		invite_data["email"] = true;
	} else {
		invite_data["email"] = false;
	}
	var newInvite = new schema.Invite(invite_data);
	newInvite.save(function(err, data) {
		if (err) {
			res.sendStatus(500);	// TODO: Implement formal error codes
		} else {
			res.send(JSON.stringify(data));
		}
	});
});

app.post('/sendEmailInvite/:invite_id', function(req, res) {
	schema.Invite.findById(req.params.invite_id, function(err, invite) {
		if (err) {
			console.log(err);
			res.send(500);			// TODO: Implement formal error codes. Might just be able to send err from callback
		} else {
			var body_html = invite.inviter + ' has invited you to Gigster! Accept the inviation by clicking <a href="/acceptInvite/"' + invite._id + '">here</a>';
			var mailOptions = {
    			to: invite.invitee, 
    			subject: 'Join Gigster!',
    			html: body_html
			};
			transporter.sendMail(mailOptions, function(error, info) {
   				if (error) {
   					console.log("Error sending email" + error);
   					res.send(500);
   				} else {
        			console.log(info);
        			res.send(200)
   				}

   			});
   		}
    });
});

app.post('/sendSMSInvite/:invite_id', function(req, res) {
	schema.Invite.findById(req.params.invite_id, function(err, invite) {
		if (err) {
			console.log(err);
			res.send(500);			// TODO: Implement formal error codes. Might just be able to send err from callback
		} else {
			// TODO: Implement sending SMS invite
			res.send(200);
		}
	});
	
});

app.post('/acceptInvite/:invide_id', function(req, res) {
	schema.Invite.findById(req.params.invite_id, function(err, invite) {
		if (err) {
			console.log(err);
			res.send(500);			// TODO: Implement formal error codes. Might just be able to send err from callback
		} else {
			invite['accepted'] = true;
			invite.save();
			res.send(200);
		}
	});
});

var PORT_NUM = process.env.PORT || 3000
app.listen(PORT_NUM);
console.log("Listening on port: " + PORT_NUM)

