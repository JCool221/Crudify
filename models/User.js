const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: 
    {      
      type: String, 
      required: [true, 'Please enter a valid email'],
      unique: true,
      trimmed: true,
    },
    email: 
    {      
      type: String,
      required: [true, 'Please enter a valid email'],
      lowercase: true,
      unique: true,
      validate: {
        validator: function(v) {
          return 	/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'thoughts',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      }
    ]
},
{
  toJSON: {
    virtuals: true,
  },
  id: false,
}
);

// Create a virtual property `friendCount` that that retrieves the length of the friend array
userSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.length
  });

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;
