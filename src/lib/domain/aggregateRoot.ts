import { Entity } from "./entity";
import { UniqueEntityId } from "./uniqueEntityId";

export abstract class AggregateRoot<T> extends Entity<T> {
  get id(): UniqueEntityId {
    return this._id;
  }
}
