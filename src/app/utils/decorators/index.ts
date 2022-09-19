import { Get, Post } from "./handler.decorator";
import Controller from "./controller.decorator";
import * as Decorator from "@overnightjs/core"

export const Route = {
  ...Decorator
};

export const App = {
  Controller : Decorator.Controller
};
