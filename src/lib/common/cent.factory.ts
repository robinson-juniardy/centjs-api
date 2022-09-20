import { methodDecoratorFactory, Methods } from "./cent.common"

export const Get    = methodDecoratorFactory(Methods.get)
export const Post   = methodDecoratorFactory(Methods.post)
export const Put    = methodDecoratorFactory(Methods.put)
export const Patch  = methodDecoratorFactory(Methods.patch)
export const Delete = methodDecoratorFactory(Methods.delete) 