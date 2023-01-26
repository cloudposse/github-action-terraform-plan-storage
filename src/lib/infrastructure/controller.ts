export interface IController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute(req: any, res: any): Promise<any>;
}
