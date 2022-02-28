"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const User = require('../../models/User');
const generateAccessToken = require('../../authentication/generateAccessToken');
exports.list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersList = yield User.find();
    res.status(200).send(usersList);
});
exports.details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = yield User.findById(req.params._id);
    res.status(200).send(userDetails);
});
exports.register = (req, res) => {
    const phoneOrEmail = () => {
        const isEmail = req.body.phoneOrEmail.includes('@');
        if (isEmail) {
            return {
                email: req.body.phoneOrEmail
            };
        }
        else {
            return {
                phone: req.body.phoneOrEmail
            };
        }
    };
    const newUser = new User(Object.assign(Object.assign({}, phoneOrEmail()), { username: req.body.username, password: crypto_1.default.createHash('md5').update(req.body.password).digest('hex'), fullName: req.body.fullName, isPrivate: false, isVerified: true, profilePicUrl: 'https://instaclone-assets.s3.eu-west-3.amazonaws.com/images/profile.jpg', followers: [], following: [] }));
    console.log(req.body);
    newUser.save()
        .then((userInfos) => {
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
            });
            res.status(201).send({
                successfullyRegistered: true,
                accessToken: accessToken
            });
        }
        else {
            res.send({
                successfullyRegistered: false
            });
        }
    })
        .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'An error occured' });
    });
};
exports.create = (req, res) => {
    const newUser = new User(req.body);
    newUser.save()
        .then((data) => {
        res.status(200).send(data);
    })
        .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'An error occured' });
    });
};
exports.createDefault = (req, res) => {
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
    });
    newUser.save()
        .then((data) => {
        res.status(200).send(data);
    })
        .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'An error occured' });
    });
};
exports.update = (req, res) => {
    const file = req.files;
    const fileLocation = file[0].location;
    console.log(file);
    const updatedUserInfos = file.length > 0 ? Object.assign(Object.assign({}, req.body), { profilePicUrl: fileLocation }) : req.body;
    User.findByIdAndUpdate(req.params._id, updatedUserInfos, { new: true })
        .then((userInfos) => {
        console.log(userInfos);
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
        });
        res.status(200).send({ accessToken });
    })
        .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'An error occured' });
    });
};
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params._id)
        .then((data) => {
        res.status(200).send(data);
    })
        .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'An error occured' });
    });
};
exports.login = (req, res) => {
    const username = req.body.username;
    const password = crypto_1.default.createHash('md5').update(req.body.password).digest('hex');
    User.findOne({
        $or: [
            { username: username },
            { email: username },
            { phone: username }
        ],
        $and: [
            { password: password }
        ]
    }).select({ createdAt: 0, updatedAt: 0 })
        .then((userInfos) => {
        console.log(userInfos);
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
            });
            res.status(200).send({
                successfullyLogged: true,
                accessToken: accessToken
            });
        }
        else {
            res.status(401).send({
                successfullyLogged: false
            });
        }
    })
        .catch((err) => {
        console.log(err);
        res.status(401).send({
            successfullyLogged: false
        });
    });
};
exports.logout = (req, res) => {
    res.status(204).send("Successfully logged out");
};
exports.checkToken = (req, res) => {
    res.status(200).send(req.user);
};
