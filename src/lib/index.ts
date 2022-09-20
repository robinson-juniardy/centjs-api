import express, {
  Request as ExRequest,
  Response as ExResponse,
  NextFunction,
  Router as ExRouter,
  Handler as Exhandler,
} from "express";

import path from "path"
import fs from "fs"

import cors from "cors"

import { Server as OVServer } from "@overnightjs/core";

import mssql, { IResult } from "mssql"
import mysql from "mysql"
import pgsql, { Client, Pool, QueryResult, ResultBuilder } from "pg"

export namespace CentJs {

    export type Request = ExRequest
    export type Response = ExResponse
    export type Next = NextFunction
    export type Handler = Exhandler

    export interface MssqlConfigProvider {
        user: string;
        password: string;
        database: string;
        server: string;
        pool: {
            max: number;
            min: number;
            idleTimeoutMillis: number;
        };
        options: {
            encrypt: boolean;
            trustServerCertificate: boolean;
        };
    }

    export interface PgSQLConfigProvider {
        user: string;
        host: string;
        database: string;
        password: string;
        port: number;
    }

    export interface MySQLConfigProvider {
        host: string;
        user: string;
        password: string;
        database: string;
    }

    export enum DBProviders {
        sqlserver = "sqlserver",
        pgsql = "pgsql",
        mysql = "mysql"
    }

    export type DbContextProvider = 
        | {
            provider: "sqlserver";
            config: MssqlConfigProvider;
        } | {
            provider: "pgsql";
            config: PgSQLConfigProvider;
        } | {
            provider: "mysql";
            config: MySQLConfigProvider
        }

    export abstract class Application {
        public static Instance = express
        public static Routers = ExRouter
    }

    export class Server extends OVServer {
        constructor() {
            super()

            this.app.use(cors())
            this.app.use(express.json())
            this.app.use(express.urlencoded({ extended: true }))

            /**
             * register controllers
             */
            const ControllerDir = path.join(process.cwd(), "src/app/controller")
            fs.readdir(ControllerDir, (err, directory) => {
                directory.forEach((file) => {
                    fs.readdir(path.join(ControllerDir, file), (err, files) => {
                        if (files.length > 0) {
                            files.forEach((controllerFile) => {
                                const controller = require(path.join(ControllerDir, file, controllerFile)).default
                                if (typeof controller !== "undefined") {
                                    this.app.use()
                                }
                            })
                        }
                    })
                })
            })
        }

        public start(port: number) {
            this.app.listen(port, () => {
                console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
            })
        }
    }

    export class Database {
        protected _connection: DbContextProvider
        protected _query: string
        protected _result: Array<any> | any

        constructor(dbConnection: DbContextProvider) {
            this._connection = dbConnection
            this._query
            this._result
        }

        public Execute(query: string) {
            this._query = query
            return this
        }

        set resultdata(params) {
            this._result = params
        }


        public async Results(options?: "rows" | "rowCount" | "recordset" | "rowsAffected" | "recordsets" | "output",
            withApiContext: boolean = false,
            apiCustomMessage?: { onSuccess?: string, onFailed?: string, onNotFoundRow?: string }) {
            if (this._connection.provider === DBProviders.sqlserver) {
                return mssql.connect(this._connection.config).then((pool) => {
                    return pool.request().query(this._query)
                }).then((result) => {
                    if (withApiContext) {
                        return ({
                            status: 1,
                            message: result.recordset.length > 0 ?
                                [apiCustomMessage?.onSuccess ? apiCustomMessage.onSuccess : "success"] :
                                [apiCustomMessage?.onNotFoundRow ? apiCustomMessage.onNotFoundRow : "data not found"],
                            data: result[options]
                        })
                    } else {
                        this.resultdata = result[options] 
                    }
                }).catch(error => {
                    console.error(error)
                    if (withApiContext) {
                        return ({
                            status: 0,
                            message: [apiCustomMessage.onFailed ? apiCustomMessage.onFailed : "db service unavailable, connection crash"],
                            data: []
                        })
                    } else {
                        return []
                    }
                })
            }

            if (this._connection.provider === DBProviders.pgsql) {
                try {
                    return options
                        ? (await new Pool(this._connection.config).query(this._query))[options]
                        : (await new Pool(this._connection.config).query(this._query))
                    
                    // console.log(pool)
                    // return this._result = poo
                } catch (error) {
                    console.error(error);
                    return this._result = []
                }
            }
            console.log(this._result)
            return this._result
        }
    }
}