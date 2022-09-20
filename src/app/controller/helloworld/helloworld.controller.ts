import { CentJs } from "../../../lib";
// import { App, Route } from "../utils/decorators";
import { Controller, Middlewares } from "../../../lib/common/cent.common";
import { Get, Post } from "../../../lib/common/cent.factory";

function TestMiddleware(request: CentJs.Request, response: CentJs.Response, next: CentJs.Next) {
    next()
}

@Controller("/api")
export default class Helloworld {
    @Get("/hello")
    @Middlewares([TestMiddleware])
    public async Helloworld(request: CentJs.Request, response: CentJs.Response) {
        response.json("hello world")
    }

}