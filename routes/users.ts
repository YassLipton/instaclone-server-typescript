import { Request, Router } from "express"
import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'

const router: Router = Router()

const userController = require('../controllers/user')

const validateToken = require('../../authentication/validateToken')

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

/* Documented routes */
router.get('/:_id', userController.details)
router.get('/list', userController.list)
router.get('/create', userController.create)
router.post('/register', userController.register)
router.put('/update/:_id', s3upload.array('image'), userController.update)
router.delete('/delete/:_id', userController.delete)

/* Routes to document */
router.post('/login', userController.login)
router.delete('/logout', userController.logout)
router.get('/checkToken/:token', validateToken, userController.checkToken)

/* Test routes */
router.get('/createDefault', userController.createDefault)

module.exports = router