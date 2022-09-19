import express, {
  Request as ExRequest,
  Response as ExResponse,
  NextFunction,
  Router,
  Handler as Exhandler,
} from "express";

import mssql, { IResult } from "mssql"
import mysql from "mysql"
import pgsql, { Client, Pool, QueryResult, ResultBuilder } from "pg"

export namespace CentJs {

    export type Request = ExRequest
    export type Response = ExResponse

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
        public static Routers = Router
    }

    export class Database {
        protected _connection: DbContextProvider
        protected _query: string
        protected _result: Array<any> | any = []

        constructor(dbConnection: DbContextProvider) {
            this._connection = dbConnection
            this._query
            this._result
        }

        public Execute(query: string) {
            this._query = query
            return this
        }


        public async Results(options?: "rows" | "rowCount") {
            if (this._connection.provider === DBProviders.sqlserver) {
                mssql.connect(this._connection.config).then((pool) => {
                    return pool.request().query(this._query)
                }).then((result) => {
                    this._result = result.recordset
                }).catch(error => {
                    console.error(error)
                    this._result = []
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
            return this._connection.config
        }
    }
}