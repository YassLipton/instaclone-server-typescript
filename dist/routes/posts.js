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
const postController = require('../controllers/post');
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
/* Post routes */
router.post('/create', s3upload.array('image'), postController.create);
router.get('/:_id', postController.infos);
router.put('/update/:_id', postController.update);
router.delete('/remove/:_id', postController.remove);
router.get('/listByUser/:_id', postController.listByUser);
/* Comment routes */
router.post('/comment/add', postController.createComment);
router.put('/comment/:_id', postController.infosComment);
router.put('/comment/update/:_id', postController.updateComment);
router.delete('/comment/remove/:_id', postController.removeComment);
/* Routes to document */
router.get('/', postController.list);
/* Test routes */
router.get('/createPostTest', postController.createPostTest);
router.get('/createCommentTest', postController.createCommentTest);
module.exports = router;
