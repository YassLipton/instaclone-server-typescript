"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const users = require('../routes/users');
const posts = require('../routes/posts');
const swaggerOptions = {
    definition: {
        info: {
            title: 'INSTA API',
            description: 'This is the server of a clone of instagram.com',
            contact: {
                name: 'Yass Lipton'
            },
            version: '0.1'
        },
        host: 'http://192.168.1.32:5000',
        basePath: '/'
    },
    apis: ['./docs/**/*.yaml'],
};
const swaggetDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggetDocs));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    next();
});
app.use((0, cors_1.default)({ origin: true, credentials: true }));
const dbURI = process.env.DB_URI || '<mongodb connection uri>';
mongoose_1.default.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err));
app.use(express_1.default.json());
app.use('/user', users);
app.use('/post', posts);
const PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
    console.log(`listening on *:${PORT}`);
});
module.exports = app;
