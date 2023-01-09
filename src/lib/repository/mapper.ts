export abstract class Mapper<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract toDomain(raw: any): T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract toPersistence(domain: T): any;
}
