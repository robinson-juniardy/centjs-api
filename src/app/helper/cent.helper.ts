import { CentJs } from "../../lib";
import { simande_db } from "../services/database";
import CentORMModel from "../utils/orm/cent.orm";

/**
 * @author Robby Juniardi
 * @description CentJs Helper Class - possible to add new custom helper with static method
 */
export default class CentHelper {

    /**
     * @author Robby Juniardi
     * @description for generate random string with options
     * @param {!number} length - length of random string
     * @param {!string} randomStrPayload - random character of string for mixing
     * @param {BufferEncoding} encode - encoding style for generate random string
     * @returns {string} string buffer
     */

    public static GenerateRandomString(length: number, randomStrPayload: string, encode: BufferEncoding): string {
        function randomString(len: number, str: string){
            let payload = ''
            for(let i = len; i > 0; i--){
                payload += str[Math.floor(Math.random() * str.length)]
            }
            return payload
        }

        const random = new Buffer(randomString(length, randomStrPayload)).toString(encode)
        return random
    }

    public static DateIncrement(incrementalPayload: number): string {
        const Day = new Date().getDate()
        const date = new Date()
        date.setDate(Day + incrementalPayload)
        return new Date(date).toISOString().slice(0, 19).replace('T', ' ')
    }

    public static async GetUserInfo(token: string) {
        const userInfoQuery = new CentORMModel("SC_AUTHORIZATION").fetchAll().where({
            TOKEN: token
        })
        const UserInfoData: any[] = await simande_db.Execute(userInfoQuery.results()).Results("recordset")
        
        if (UserInfoData.length > 0) {
            return UserInfoData[0]
        } else {
            return null
        }
    }
}