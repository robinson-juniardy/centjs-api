import { CentJs } from "./lib";
import cors from "cors";
import { config } from "dotenv";
import "reflect-metadata";
import LoadRouters from "./lib/common/cent.router";

config();

const cent = CentJs.Application.Instance();

const port = process.env.PORT;

cent.use(cors());
cent.use(CentJs.Application.Instance.json());
cent.use(CentJs.Application.Instance.urlencoded({ extended: true }));

cent.use(LoadRouters())

cent.listen(port, () => {
    // console.log(LoadRouters())
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
});