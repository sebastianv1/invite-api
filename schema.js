var mongoose = require('mongoose');

var inviteSchema = mongoose.Schema({
	inviter: String,
	invitee: String,
	accepted: Boolean,
	email: Boolean
});
var Invite = mongoose.model('Invite', inviteSchema);

module.exports = {Invite}