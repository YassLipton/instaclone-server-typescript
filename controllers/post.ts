import { Request, Response } from "express"

const Post = require('../../models/Post')
const Comment = require('../../models/Comment')

interface IPost {
  images: [{
    index: number,
    link: string
  }],
  user: string,
  comments: string[],
  caption: string,
  location: string,
  usersWhoLiked: string[],
}

interface MulterS3File extends Express.Multer.File {
  location: string
}

exports.list = async (req: Request, res: Response) => {
  const postsList: IPost = await Post.find()
    .sort({createdAt: -1})
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    })
  res.status(200).send(postsList)
}

exports.listByUser = (req: Request, res: Response) => {
  Post.find({user: req.params._id})
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    })
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.infos = (req: Request, res: Response) => {
  Post.findById(req.params._id)
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.remove = (req: Request, res: Response) => {
  Post.findByIdAndRemove(req.params._id)
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.update = (req: Request, res: Response) => {
  Post.findByIdAndUpdate(req.params._id, req.body)
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.updateComment = (req: Request, res: Response) => {
  Comment.findByIdAndUpdate(req.params._id, req.body)
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.removeComment = (req: Request, res: Response) => {
  Comment.findByIdAndRemove(req.params._id)
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.infosComment = (req: Request, res: Response) => {
  Comment.findById(req.params._id)
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.createComment = (req: Request, res: Response) => {

  const userId = req.body.userId
  const postId = req.body.postId
  const commentText = req.body.commentText

  const newComment = new Comment({
    user: userId,
    post: postId,
    text: commentText,
    userWhoLiked: []
  })
  newComment.save()
    .then((comment: any) => {
      console.log(comment)
      Post.findByIdAndUpdate(postId, {$push: {comments: comment._id.toString()}})
        .then((data: any) => {
          console.log(data)
          res.status(200).send(data)
        })
        .catch((error: any) => {
          console.log(error)
          res.status(500).send({ message: 'An error occured' })
        })
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.create = (req: Request, res: Response) => {

  const userId = req.body.userId
  const file = req.files as MulterS3File[]
  const fileLocation = file[0].location
  const caption = req.body.caption
  const location = req.body.location

  console.log(file)

  const newPost = new Post({
    images: [{
      index: 0,
      link: fileLocation
    }],
    caption: caption,
    location: location,
    userWhoLiked: [],
    user: userId,
    comments: []
  })
  newPost.save()
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.createPostTest = (req: Request, res: Response) => {
  const newPost = new Post({
    images: [{
      index: 0,
      link: 'https://scontent-mrs2-1.cdninstagram.com/v/t51.2885-15/fr/e15/p1080x1080/272922884_468033268327633_6568527683557661921_n.jpg?_nc_ht=scontent-mrs2-1.cdninstagram.com&_nc_cat=1&_nc_ohc=I4gbnBToKYsAX8-pPem&tn=n2rxoHk9qWDWHxSv&edm=ALQROFkBAAAA&ccb=7-4&ig_cache_key=Mjc2MDYwNzExNDA5NjMzNzAwOA%3D%3D.2-ccb7-4&oh=00_AT9nt459zOqfqsF0b5VFOiahz1PDJ3rWvvBzPm5xh_RxMw&oe=62046D5F&_nc_sid=30a2ef'
    }],
    caption: 'Caption text',
    userWhoLiked: ['620188af18f47e8f499f5547'],
    user: '61fe96c475ae6c62c3c957fa',
    comments: ['61fd89585af2d0f48ed57044']
  })
  newPost.save()
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.createCommentTest = (req: Request, res: Response) => {
  const newComment = new Comment({
    user: '61fda2ba11cccdd7c7b3f787',
    post: '61fe97a2879cdc8559f25241',
    text: 'Comment text',
    commentLikeCount: 0
  })
  newComment.save()
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}