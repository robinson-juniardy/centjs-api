import { CentJs } from "../../../lib"
import { Controller, Middlewares } from "../../../lib/common/cent.common";
import { Get, Post } from "../../../lib/common/cent.factory";

function TestMiddleware(request: CentJs.Request, response: CentJs.Response, next: CentJs.Next) {
    next()
}

@Controller("/api")
export default class Welcome {
    @Get("/welcome", [TestMiddleware])
    public async WelcomeMessage(request: CentJs.Request, response: CentJs.Response) {
        response.json("hello welcome")
    }

}