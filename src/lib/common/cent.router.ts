import { CentJs } from "..";
// import { GetInstance } from "./cent.common";
import path from "path"
import fs from "fs"
import { Metadata, methodDecoratorFactory, Methods, IRouter } from "./cent.common";
function GetInstance<constructor>(Controller: new (...args: any[]) => constructor) {
    if (typeof Controller !== "undefined") {
        const RouterInstance: IRouter[] = Reflect.hasMetadata(Metadata.routers, Controller)
            ? Reflect.getMetadata(Metadata.routers, Controller) : []
        const basePath = Reflect.getMetadata(Metadata.basepath, Controller)

        const instances : {
            [propertyKey: string] : CentJs.Handler
        } = new Controller() as any

        const Router = CentJs.Application.Routers()

        RouterInstance.forEach((instance) => {
            if (typeof instance.middleware !== "undefined") {
                Router[instance.method](
                    basePath + instance.path,
                    Array.isArray(instance.middleware) ? [...instance.middleware] : instance.middleware,
                    instances[String(instance.handlerName)].bind(instances)
                )
            } else {
                Router[instance.method](
                    basePath + instance.path,
                    instances[String(instance.handlerName)].bind(instances)
                )
            }
        })

        // console.log(Router)

        return Router
    }
}

export default function LoadRouters() {
    const modulePath = path.join(process.cwd(), "src/app/controller")
    const modules = fs.readdirSync(modulePath)
    
    let controllerList: Array<any> = []
    for (let file of modules) {
        const controller = fs.readdirSync(path.join(modulePath, file))
        for (let constructor of controller) {
                controllerList = controllerList.concat(path.join(modulePath, file, String(constructor)))
            }
    }
    
    let routers: Array<any> = []
    
    
    for (let controller of controllerList) {
        let file = require(controller).default

        if (typeof file !== "undefined") {
            routers = routers.concat(file)
        }
        
    }
    
    let router_list : Array<any> = []
    for (let instance of routers) {
            router_list = router_list.concat(GetInstance(instance))
        }
        return router_list
}





