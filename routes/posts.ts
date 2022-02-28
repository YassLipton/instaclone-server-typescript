import { Request, Router } from "express"
import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'

const router: Router = Router()

const postController = require('../controllers/post')

const ID = process.env.AWS_ID || '<AWS API ID>'
const SECRET = process.env.AWS_SECRET || '<AWS API SECRET>'

const BUCKET_NAME = 'instaclone-assets'

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
})

const s3upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req: Request, file: any, cb: any) {
      cb(null, {fieldName: file.fieldname})
    },
    key: function (req: Request, file: any, cb: any) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
})

/* Post routes */
router.post('/create', s3upload.array('image'), postController.create)
router.get('/:_id', postController.infos)
router.put('/update/:_id', postController.update)
router.delete('/remove/:_id', postController.remove)
router.get('/listByUser/:_id', postController.listByUser)

/* Comment routes */
router.post('/comment/add', postController.createComment)
router.put('/comment/:_id', postController.infosComment) 
router.put('/comment/update/:_id', postController.updateComment)
router.delete('/comment/remove/:_id', postController.removeComment)

/* Routes to document */
router.get('/', postController.list)

/* Test routes */
router.get('/createPostTest', postController.createPostTest)
router.get('/createCommentTest', postController.createCommentTest)

module.exports = router