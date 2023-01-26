import { UniqueEntityId } from "./uniqueEntityId";

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityId;
  public readonly props: T;

  constructor(props: T, id?: UniqueEntityId) {
    this._id = id ? id : new UniqueEntityId();
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    // We need to disbale this rule because there is a circular relationship between Entity and isEntity
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};
