import { CentJs } from "..";
import { GetInstance } from "./cent.common";
import path from "path"
import fs from "fs"

export default function LoadRouters() {
    const modulePath = path.join(process.cwd(), "src/app/controller")
    const modules = fs.readdirSync(modulePath)
    
    let controllerList: Array<any> = []
    for (let file of modules) {
        const controller = fs.readdirSync(path.join(modulePath, file))
        controllerList = controllerList.concat(path.join(modulePath, file, String(controller)))
    }

    let routers: Array<any> = []

    for (let controller of controllerList) {
        const controllerFileClass = require(controller).default
        routers = routers.concat(controllerFileClass)
    }

    let router_list : Array<any> = []
    for (let instance of routers) {
        router_list = router_list.concat(GetInstance(instance))
    }
    return router_list

}