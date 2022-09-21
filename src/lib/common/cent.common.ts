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

export type TMiddleware = any | any[]

export type MethodHandler = "get" | "post" | "put" | "patch" | "delete"

export interface IRouter {
    method: MethodHandler,
    path: string,
    handlerName: string | symbol,
    middleware?: any
}

export interface IControllerInstance {
    Router: IRouter[],
    middleware? : any
    handlerName: string | symbol
}

export function Controller(basePath: string, middleware? : any | any[]): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(Metadata.basepath, basePath, target)
        Reflect.defineMetadata(Metadata.middleware, middleware, target)
        
    }
}

export function Get(path: string) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(Methods.get, path, target.constructor)
        Reflect.defineMetadata(Metadata.propertyKey, propertyKey ,target.constructor)
    }
}

export function Post(path: string) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(Methods.post, path ,target.constructor)
        Reflect.defineMetadata(Metadata.propertyKey, propertyKey ,target.constructor)
    }
}


export function Patch(path: string) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(Methods.patch, path, target.constructor)
        Reflect.defineMetadata(Metadata.propertyKey, propertyKey ,target.constructor)
    }
}

export function Put(path: string) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(Methods.put, path, target.constructor)
        Reflect.defineMetadata(Metadata.propertyKey, propertyKey ,target.constructor)
    }
}

export function Delete(path: string) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(Methods.delete, path, target.constructor)
        Reflect.defineMetadata(Metadata.propertyKey, propertyKey ,target.constructor)
    }
}

export function Routes(options: IRouter) {
    return (target: any, propertyKey: string) => {
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

export function methodDecoratorFactory(method: Methods) {
    return (path: string, middleware?: any | any[]): MethodDecorator => {
        return (target: any, propertyKey: string) => {
            const controller = target.constructor

            const routers: IRouter[] = Reflect.hasMetadata(Metadata.routers, controller)
                ? Reflect.getMetadata(Metadata.routers, controller)
                : []
            
            routers.push({
                method: method,
                path,
                handlerName: propertyKey,
                middleware: middleware
            })

            Reflect.defineMetadata(Metadata.routers, routers, controller)
        }
    }
}


