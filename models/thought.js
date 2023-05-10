const { Schema, model } = require("mongoose");
const dayjs = require("dayjs");
const reactionSchema  = require("./reaction");

// Schema to create Student model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      max_length: 280,
      min_length: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => dayjs(date).format("DD/MM/YYYY"),
    //   use getter method to format timestamp on query
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);
thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
