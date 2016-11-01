var mongoose = require('mongoose');

var inviteSchema = mongoose.Schema({
	inviter: String,
	invitee: String,
	accepted: Boolean
});
var Invite = mongoose.model('Invite', inviteSchema);

module.exports = {Invite}