"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default();
// route para probar que la api este funcionando
router.get('/test', function (req, res) {
    return res.send('OK');
});
exports.default = router;
