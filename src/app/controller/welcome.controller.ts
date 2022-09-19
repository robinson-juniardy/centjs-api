import { CentJs } from "../../lib";
import { MyDB } from "../services/database";
import { App, Route } from "../utils/decorators";

@App.Controller("/")
export default class Welcome {

    @Route.Get("/welcome")
    public async WelcomeMessage(request: CentJs.Request, response: CentJs.Response) {
        const Model = MyDB
        // Model.Query = "select * from ringkasan_saham"
        response.json(await Model.Results("rows"))
    }

}