import { CentJs } from "../../../lib";
import { MyDB } from "../../services/database";
// import { App, Route } from "../utils/decorators";
import { Controller, Middlewares, Routes } from "../../../lib/common/cent.common";
import { NextFunction } from "express";

function TestMiddleware(request: CentJs.Request, response: CentJs.Response, next: NextFunction) {
    next()
}

@Controller("/api")
export default class Helloworld {
    @Routes({
        method: "get",
        path: "/hello",
    })
    @Middlewares([TestMiddleware])
    public async Helloworld(request: CentJs.Request, response: CentJs.Response) {
        response.json("hello world")
    }

}