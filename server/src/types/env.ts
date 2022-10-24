export enum Env {
  Prod = "production",
  Test = "test",
  Dev = "development",
}

export default class Environment {
  private currEnv: Env;
  constructor() {
    let env = process.env.NODE_ENV;
    let currEnv = Env.Dev;
    if (env === Env.Prod) currEnv = Env.Prod;
    else if (env === Env.Test) currEnv = Env.Test;
    this.currEnv = currEnv;
  }

  public isDev = () => this.currEnv === Env.Dev;
  public isTest = () => this.currEnv === Env.Test;
  public isProd = () => this.currEnv === Env.Prod;
}
