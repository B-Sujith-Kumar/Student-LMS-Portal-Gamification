const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    courseName:String,
    courseCode:String,
    instructor:String
  },
  { versionKey: false, timestamps: true }
);

const CourseSchema = mongoose.model("course", courseSchema);

module.exports = { CourseSchema };
