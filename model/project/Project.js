const mongoose = require("mongoose");

//create schema
const projectSchema = new mongoose.Schema(
  {
    projectlink: {
      type: String,
      //required: [true, "Project link is required."],
    },
    category: {
      type: String,
      required: [true, "Post category is required"],
    },

    title: {
      type: String,
      required: [true, "Project title is required."],
    },

    keywords: {
      type: String,
    },

    abstract: {
      type: String,
      required: [true, "Abstract/Description is required."],
    },

    languages: {
      type: String,
    },

    refrences: {
      type: String,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    isLiked: {
      type: Boolean,
      default: false,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Author is required."],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//populate Project Comments
projectSchema.virtual('projectComment' , {
  ref:'Comment',
  foreignField:'project',
  localField:'_id'
})


//Compile Project schema into model
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
