export interface ICentORMProperty {
    instanceName: string;
    fields: Array<string>;
}

export enum ORMType {
    SELECT       = "SELECT ",
    FROM         = " FROM ",
    WHERE        = " WHERE ",
    JOIN         = " JOIN ",
    ORDER        = " ORDER BY ",
    GROUP        = " GROUP BY ",
    FOREIGN_ON   = " ON ",
    FOREIGN_PAIR = " = ",
    ENDLINE      = "\n",
    UPDATE       = "UPDATE ",
    SET          = " SET ",
    OFFSET       = "OFFSET ",
    FETCH_NEXT   = "ROWS FETCH NEXT ",
    ROWS_ONLY    = " ROWS ONLY "
}

export default class CentORMModel {
    private _orderBy   : string
    private _select    : string
    private _where     : string
    private _from      : string
    private _join      : string
    private _group     : string
    private _results   : string
    private _table     : string
    private _as        : string
    private _condition : boolean

    constructor(table?: string, as?: string) {

        this._select  = ORMType.SELECT
        this._orderBy = ORMType.ORDER
        this._from    = ORMType.FROM
        this._where   = ORMType.WHERE
        this._join    = ORMType.JOIN
        this._group   = ORMType.GROUP
        this._results = ""
        this._table   = table
        this._as = as
        this._condition = false
        
        
    }

    public fetch(fields: string) {
        this._results = this._results.concat(this._select, fields , this._from, this._table)
        return this
    }

    public fetchAll() {
        this._results = this._results.concat(this._select, " * ", this._from, this._table)
        return this
    }

    public search<obj>(condition : obj) {
        const entries = Object.entries(condition).map((value) => {
            // console.log(value)
                if (typeof value[1] === "string") {
                    return `${value[0]} LIKE '${value[1] ? value[1] : '_'}%' `
                } else {
                    return `${value[0]} LIKE 'CAST(${value[1]} as varchar)%' `
                }
        })

        this._results = this._results.concat(this._condition && ` AND ${String(entries).replaceAll(",", "\nAND ")}`)
        return this
    }

    public where<T>(condition: T) {
        if (typeof condition === "string") {
            this._results = this._results.concat(ORMType.ENDLINE, this._where, condition)
            this._condition = true
        }

        if (typeof condition === "object") {
            const entries = Object.entries(condition).map((value) => {
                if (typeof value[1] === "string") {
                    return `${value[0]}='${value[1]}'`
                } else {
                    return `${value[0]}=${value[1]}`
                }
            })

            this._results = this._results.concat(ORMType.ENDLINE,
                ORMType.WHERE, String(entries).replaceAll(",", "\nAND "))
            this._condition = true
        }
            return this

    }

    public orderBy(byColumn: string, orderType: "ASC" | "DESC") {
        this._results = this._results.concat(this._orderBy, byColumn," ", orderType)
        return this
    }

    public join(type: "LEFT" | "RIGHT" | "INNER", target: string,foreignKey: string, refKey: string) {
        this._results = this._results.concat(ORMType.ENDLINE,type, ORMType.JOIN, target,
            ORMType.FOREIGN_ON,
            typeof target.split(" ")[1] !== "undefined" ? `${target.split(" ")[1]}.${foreignKey}` : `${target}.${foreignKey}`,
            ORMType.FOREIGN_PAIR, refKey
        )
        return this
    }

    public mssqlPagination<pg>(page: pg, numberRowsPerPage: number) {
        this._results = this._results.concat(ORMType.ENDLINE, ORMType.OFFSET,
            `((${page > 0 ? page as number - 1 : page}) * ${numberRowsPerPage})`, ORMType.ENDLINE,
            ORMType.FETCH_NEXT, String(numberRowsPerPage), ORMType.ROWS_ONLY
        )
        return this
    }

    public insert(payload: object) {
        const key    = Object.keys(payload)
        const value  = Object.values(payload)
        const values = []

        value.map((val) => {
            if (typeof val === "string") {
                values.push(`'${val}'`)
            } else {
                values.push(val)
            }
        })

        this._results = this._results.concat(`INSERT INTO ${this._table} ${ORMType.ENDLINE}(${key}) ${ORMType.ENDLINE}VALUES${ORMType.ENDLINE}(${values})`)
        return this
    }

    public update(payload: object) {
        let instance: Array<any> = []
        let vals : Array<any> = []
        let key = Object.keys(payload)
        let value = Object.values(payload)

        for (let val of Object.entries(payload)) {
            vals.push(val)
        }

        const v = vals.map((values, index) => {
            return `${values[0]}=${typeof values[1] === "string" ? `'${values[1]}'` : `${values[1]}`}`
        })


        this._results = this._results.concat(ORMType.UPDATE, this._table, ORMType.ENDLINE, ORMType.SET, String(v))
        return this
        
        
    }
    
    public results() {
        return this._results
    }
} 