"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const router = (0, express_1.Router)();
const userController = require('../controllers/user');
const validateToken = require('../../authentication/validateToken');
const ID = process.env.AWS_ID || '<AWS API ID>';
const SECRET = process.env.AWS_SECRET || '<AWS API SECRET>';
const BUCKET_NAME = 'instaclone-assets';
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});
const s3upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    })
});
/* Documented routes */
router.get('/:_id', userController.details);
router.get('/list', userController.list);
router.get('/create', userController.create);
router.post('/register', userController.register);
router.put('/update/:_id', s3upload.array('image'), userController.update);
router.delete('/delete/:_id', userController.delete);
/* Routes to document */
router.post('/login', userController.login);
router.delete('/logout', userController.logout);
router.get('/checkToken/:token', validateToken, userController.checkToken);
/* Test routes */
router.get('/createDefault', userController.createDefault);
module.exports = router;
