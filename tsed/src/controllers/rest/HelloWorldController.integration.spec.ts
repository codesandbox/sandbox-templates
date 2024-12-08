import { expect, describe, it, afterAll, beforeAll } from "vitest";
import { PlatformTest } from "@tsed/platform-http/testing";
import SuperTest from "supertest";
import { HelloWorldController } from "./HelloWorldController.js";
import { Server } from "../../Server.js";

describe("HelloWorldController", () => {
  beforeAll(PlatformTest.bootstrap(Server, {
    mount: {
      "/": [HelloWorldController]
    }
  }));
  afterAll(PlatformTest.reset);

  it("should call GET /hello-world", async () => {
     const request = SuperTest(PlatformTest.callback());
     const response = await request.get("/hello-world").expect(200);

     expect(response.text).toEqual("hello");
  });
});
