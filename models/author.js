const { DateTime } = require("luxon");
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});


// Virtual for author's dob
AuthorSchema
.virtual('date_of_birth_formatted')
.get(function () {
  return this.date_of_birth ?
  DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

// Virtual for author's dob
AuthorSchema
.virtual('date_of_death_formatted')
.get(function () {
  return this.date_of_death ?
  DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  var year_of_birth = this.date_of_birth ?
    DateTime.fromJSDate(this.date_of_birth) : '';
  var year_of_death = this.date_of_death ?
    DateTime.fromJSDate(this.date_of_death) : DateTime.now();
  var lifespan =  year_of_death.year - year_of_birth.year;
  return lifespan ?
    lifespan.toString() : 'N/A';
});
// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);

