import e from "express";
import { CentJs } from "../../lib";
import { config } from "../utils/config/cent.config";
import CentORMModel from "../utils/orm/cent.orm";
import { simande_db } from "./database";

export default class CentMiddleware {
    public static async Authorization(request: CentJs.Request, response: CentJs.Response, next: CentJs.Next) {
        if (config.security_token) {
            if (!request.headers.authorization) {
                response.json({
                    status: 0,
                    message: ["access forbidden : token not found !!"],
                    data: []
                })
            } else {
                if (request.headers.authorization.split(" ")[0] !== "Bearer") {
                    response.json({
                        status: 0,
                        message: ["access forbidden : wrong auth method !!"],
                        data: []
                    })
                } else {

                    const incomingToken = request.headers["authorization"].split(" ")[1]
                    const checkToken = new CentORMModel("SC_AUTHORIZATION")
                        .fetchAll()
                        .where(`TOKEN = '${incomingToken}' AND USERS_ID IS NOT NULL`)
                    const result = await simande_db.Execute(checkToken.results()).Results("recordset") as []

                    if (result.length > 0) {
                        next()
                    } else {
                        response.json({
                            status: 0,
                            message: ["auth failed : token not registered !!"],
                            data: []
                        })
                    }
                }
            }
        } else {
            next()
        }
    }
}