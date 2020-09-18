"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __importDefault(require("."));
var port = process.env.PORT || 3000; // TODO: cambiar el puerto de ejecucion
_1.default.listen(port, function () {
    console.log("Server run on port: ", port);
});
