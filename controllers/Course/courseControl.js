const expressAsyncHandler = require("express-async-handler");
const Course = require("../../model/Courses/courses");
const validateMongodbId = require("../../utils/validateMongodbID");

//----------------------------------------------------------------
//CREATE PUBLICATION
//----------------------------------------------------------------

const createPublicationCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.file);
  const { _id } = req.user;
  try {
    const project = await Course.create({
      ...req.body,
      user: _id,
    });
    res.json(project);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------
//Fetch all Publication
//-------------------------------
const fetchPublicationsCtrl = expressAsyncHandler(async (req, res) => {
  const hasPaperCategory = req.query.category
  try {
    if(hasPaperCategory){
      const publications = await Course.find({category:hasPaperCategory}).populate("user").sort('-createdAt');
    res.json(publications);
    }
    else{
    const publications = await Course.find({}).populate("user").sort('-createdAt');
    res.json(publications);
    }
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Fetch a single Publication
//------------------------------

const fetchPublicationCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const publication = await Course.findById(id).populate("user");
    //update number of views
    await Course.findByIdAndUpdate(
      id,
      {
        $inc: { viewCount: 1 },
      },
      { new: true }
    );
    res.json(publication);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
// Update publication
//------------------------------

const updatePublicationCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const publication = await Course.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      {
        new: true,
      }
    );
    res.json(publication);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Delete Publication
//------------------------------

const deletePublicationCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const publication = await Course.findOneAndDelete(id);
    res.json(publication);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Likes
//------------------------------

const toggleAddLikeToPublicationCtrl = expressAsyncHandler(async (req, res) => {
  //1.Find the post to be liked
  const { postId } = req.body;
  const post = await Course.findById(postId);
  //2. Find the login user
  const loginUserId = req?.user?._id;
  //3. Find is this user has liked this post?
  const isLiked = post?.isLiked;
  //4.Chech if this user has dislikes this post
  const alreadyDisliked = post?.disLikes?.find(
    userId => userId?.toString() === loginUserId?.toString()
  );
  //5.remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const post = await Course.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  //Toggle
  //Remove the user if he has liked the post
  if (isLiked) {
    const post = await Course.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    //add to likes
    const post = await Course.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

module.exports = { 
  createPublicationCtrl,
  fetchPublicationsCtrl,
  fetchPublicationCtrl,
  updatePublicationCtrl,
  deletePublicationCtrl,
  toggleAddLikeToPublicationCtrl,
  
};
