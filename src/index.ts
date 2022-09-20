import { CentJs } from "./lib";
import path from "path";
import cors from "cors";
import { config } from "dotenv";
import fs from "fs";
import "reflect-metadata";
import CentORMModel from "./app/utils/orm/cent.orm";
import Welcome from "./app/controller/welcome/welcome.controller"
import { GetInstance } from "./lib/common/cent.common"
import LoadRouters from "./lib/common/cent.router";

config();

const cent = CentJs.Application.Instance();

const port = process.env.PORT;

cent.use(cors());
cent.use(CentJs.Application.Instance.json());
cent.use(CentJs.Application.Instance.urlencoded({ extended: true }));

cent.use(LoadRouters())

cent.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
});