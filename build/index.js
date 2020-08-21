"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var passport_1 = __importDefault(require("passport"));
var cors_1 = __importDefault(require("cors"));
// import passportMiddleware from './middlewares/passport';
var index_routes_1 = __importDefault(require("./index.routes"));
// Init app
var app = express_1.default();
// Midlewares
app.use(morgan_1.default('dev'));
app.use(cors_1.default());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
// passport.use(passportMiddleware); TODO: descomentar esta linea de codigo para el passport con jwt
// Routes
app.use(index_routes_1.default);
// Config
exports.default = app;