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
    ENDLINE      = "\n"
}

export default class CentORMModel {
    private _orderBy : string
    private _select  : string
    private _where   : string
    private _from    : string
    private _join    : string
    private _group   : string
    private _results : string
    private _table   : string

    constructor(table?: string) {

        this._select  = ORMType.SELECT
        this._orderBy = ORMType.ORDER
        this._from    = ORMType.FROM
        this._where   = ORMType.WHERE
        this._join    = ORMType.JOIN
        this._group   = ORMType.GROUP
        this._results = ""
        this._table   = table
        
    }

    public fetch(fields: string) {
        this._results = this._results.concat(this._select, fields , this._from, this._table)
        return this
    }

    public fetchAll() {
        this._results = this._results.concat(this._select, " * ", this._from, this._table)
        return this
    }

    public orderBy(byColumn: string, orderType: "ASC" | "DESC") {
        this._results = this._results.concat(this._orderBy, byColumn," ", orderType)
        return this
    }

    public join(type: "LEFT" | "RIGHT" | "INNER", target: string, foreignKey: string, refKey: string) {
        this._results = this._results.concat(ORMType.ENDLINE,type, ORMType.JOIN, target,
            ORMType.FOREIGN_ON,
            target, ".", foreignKey,
            ORMType.FOREIGN_PAIR, refKey
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


    
    public results() {
        return this._results
    }


} 