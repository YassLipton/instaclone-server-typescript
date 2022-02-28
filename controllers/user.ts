import { Request, Response } from "express"
import crypto from 'crypto'

const User = require('../../models/User')
const generateAccessToken = require('../../authentication/generateAccessToken')

interface IUser {
  _id: string,
  username: string,
  password: string,
  fullName: string,
  email: string,
  phone: string,
  bio: string,
  link: string,
  isPrivate: boolean,
  isVerified: boolean,
  profilePicUrl: string,
  followers: Array<string>,
  following: Array<string>,
}

interface MulterS3File extends Express.Multer.File {
  location: string
}

exports.list = async (req: Request, res: Response) => {
  const usersList: Array<IUser> = await User.find()
  res.status(200).send(usersList)
}

exports.details = async (req: Request, res: Response) => {
  const userDetails: IUser = await User.findById(req.params._id)
  res.status(200).send(userDetails)
}

exports.register = (req: Request, res: Response) => {
  
  const phoneOrEmail = () => {
    const isEmail = req.body.phoneOrEmail.includes('@')
    if (isEmail) {
      return {
        email: req.body.phoneOrEmail
      }
    } else {
      return {
        phone: req.body.phoneOrEmail
      }
    }
  }

  const newUser = new User({
    ...phoneOrEmail(),
    username: req.body.username,
    password: crypto.createHash('md5').update(req.body.password).digest('hex'),
    fullName: req.body.fullName,
    isPrivate: false,
    isVerified: true,
    profilePicUrl: 'https://instaclone-assets.s3.eu-west-3.amazonaws.com/images/profile.jpg',
    followers: [],
    following: []
  })
  console.log(req.body)
  newUser.save()
    .then((userInfos: IUser) => {
      if (userInfos) {
        const accessToken = generateAccessToken({ 
          _id: userInfos._id,
          username: userInfos.username,
          fullName: userInfos.fullName,
          email: userInfos.email,
          phone: userInfos.phone,
          bio: userInfos.bio,
          link: userInfos.link,
          isPrivate: userInfos.isPrivate,
          isVerified: userInfos.isVerified,
          profilePicUrl: userInfos.profilePicUrl,
          followers: userInfos.followers,
          following: userInfos.following
        })
        res.status(201).send({
          successfullyRegistered: true,
          accessToken: accessToken
        })
      } else {
        res.send({
          successfullyRegistered: false
        })
      }
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.create = (req: Request, res: Response) => {
  const newUser = new User(req.body)
  newUser.save()
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.createDefault = (req: Request, res: Response) => {
  const newUser = new User({
    username: 'manchesterunited',
    password: '721c6ff80a6d3e4ad4ffa52a04c60085',
    firstName: 'Manchester',
    lastName: 'United',
    email: 'mufc@mail.com',
    phone: '+33767642034',
    isPrivate: false,
    isVerified: true,
    profilePicUrl: 'https://instaclone-assets.s3.eu-west-3.amazonaws.com/images//mufc.jpg',
    followers: ['61fedea9b2390d99853190af'],
    following: []
  })
  newUser.save()
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.update = (req: Request, res: Response) => {

  const file = req.files as MulterS3File[]
  const fileLocation = file[0].location

  console.log(file)

  const updatedUserInfos: IUser = file.length > 0 ? {...req.body, profilePicUrl: fileLocation} : req.body

  User.findByIdAndUpdate(req.params._id, updatedUserInfos, {new: true})
    .then((userInfos: IUser) => {
      console.log(userInfos)
      const accessToken = generateAccessToken({ 
        _id: userInfos._id,
        username: userInfos.username,
        fullName: userInfos.fullName,
        email: userInfos.email,
        phone: userInfos.phone,
        bio: userInfos.bio,
        link: userInfos.link,
        isPrivate: userInfos.isPrivate,
        isVerified: userInfos.isVerified,
        profilePicUrl: userInfos.profilePicUrl,
        followers: userInfos.followers,
        following: userInfos.following
       })
      res.status(200).send({accessToken})
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.delete = (req: Request, res: Response) => {
  User.findByIdAndRemove(req.params._id)
    .then((data: any) => {
      res.status(200).send(data)
    })
    .catch((error: any) => {
      console.log(error)
      res.status(500).send({ message: 'An error occured' })
    })
}

exports.login = (req: Request, res: Response) => {

  const username = req.body.username
  const password = crypto.createHash('md5').update(req.body.password).digest('hex') 

  User.findOne({
    $or: [
      {username: username}, 
      {email: username}, 
      {phone: username}
    ],
    $and: [
      {password: password}
    ]
  }).select({createdAt: 0, updatedAt: 0})
    .then((userInfos: IUser) => {
      console.log(userInfos)
      if (userInfos) {
        const accessToken = generateAccessToken({ 
          _id: userInfos._id,
          username: userInfos.username,
          fullName: userInfos.fullName,
          email: userInfos.email,
          phone: userInfos.phone,
          bio: userInfos.bio,
          link: userInfos.link,
          isPrivate: userInfos.isPrivate,
          isVerified: userInfos.isVerified,
          profilePicUrl: userInfos.profilePicUrl,
          followers: userInfos.followers,
          following: userInfos.following
         })
        res.status(200).send({
          successfullyLogged: true,
          accessToken: accessToken
        })
      } else {
        res.status(401).send({
          successfullyLogged: false
        })
      }
    })
    .catch((err: any) => {
      console.log(err)
      res.status(401).send({
        successfullyLogged: false
      })
    })
}

exports.logout = (req: Request, res: Response) => {
  res.status(204).send("Successfully logged out")
}

interface CheckTokenRequest extends Request {
  user: IUser
}

exports.checkToken = (req: CheckTokenRequest, res: Response) => {
  res.status(200).send(req.user)
}