/**
 * All Decorator Function
 */

import { application, Handler, Router } from "express"

export enum Metadata {
    basepath = "base_path",
    routers = "routers",
    middleware = "middleware",
    repository = "repository",
    serializer = "serializer",
    controller = "controller",
    column = "column",
    propertyKey = "propertyKey"
}

export enum Methods {
    get = "get",
    post = "post",
    patch = "patch",
    put = "put",
    delete = "delete"
}

export type MethodHandler = "get" | "post" | "put" | "patch" | "delete"

interface IRouter {
    method: MethodHandler,
    path: string
}

interface IControllerInstance {
    Router: IRouter[],
    middleware? : any
    handlerName: string | symbol
}

export function Controller(basePath: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(Metadata.basepath, basePath, target)
    }
}

export function Routes(options: IRouter) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const constructor = target.constructor
        Reflect.defineMetadata(Metadata.routers, options, constructor)
        Reflect.defineMetadata(Metadata.propertyKey, propertyKey, constructor)
    }
}

export function Repository(table: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(Metadata.repository, table, target)
    }
}

export function Middlewares(middleware: any | any[]) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(Metadata.middleware, middleware, target.constructor)
    }
}

export function Serialize(serializeName: string) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(Metadata.serializer, serializeName, target.constructor)
    }
}

export function Column() {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(Metadata.column, propertyKey, target.constructor)
    }
}

export function GetInstance<controller>(Controller : new(...args: any[]) => controller) {
    const Routes: IRouter[] = Reflect.getMetadata(Metadata.routers, Controller)
    const ControllerInstances : IControllerInstance[] = []
    const basePath: string = Reflect.getMetadata(Metadata.basepath, Controller)
    const middlewares : any = Reflect.getMetadata(Metadata.middleware, Controller)
    const propertyKey: string = Reflect.getMetadata(Metadata.propertyKey, Controller)
    ControllerInstances.push({
        Router: Routes,
        middleware: middlewares,
        handlerName: propertyKey
    })

    const instances: {
        [propertyKey: string] : Handler
    } = new Controller() as any

    const CentRouter = Router() 
    ControllerInstances.forEach((instance) => {
        if (typeof instance.middleware !== "undefined") {
            CentRouter[instance.Router["method"]](basePath + instance.Router["path"], instance.middleware ,instances[String(instance.handlerName)].bind(instances))   
        } else {
            CentRouter[instance.Router["method"]](basePath + instance.Router["path"],instances[String(instance.handlerName)].bind(instances))   
        }
    })
    
    return CentRouter
}


