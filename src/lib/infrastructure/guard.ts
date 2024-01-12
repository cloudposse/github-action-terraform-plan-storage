export type GuardResponse = string;

import { Result } from "./result";

export interface IGuardArgument {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static againstNullOrUndefined(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    argument: any,
    argumentName: string
  ): Result<GuardResponse> {
    if (argument === null || argument === undefined) {
      return Result.fail<GuardResponse>(
        `${argumentName} is null or undefined.`
      );
    } else {
      return Result.ok<GuardResponse>();
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): Result<GuardResponse> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName
      );
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }

  public static againstMinLength(
    numChars: number,
    text: string,
    argumentName: string
  ): Result<GuardResponse> {
    return text.length >= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `${argumentName} is not at least ${numChars} chars.`
        );
  }

  public static againstMaxLength(
    numChars: number,
    text: string,
    argumentName: string
  ): Result<GuardResponse> {
    return text.length <= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `${argumentName} is greater than ${numChars} chars.`
        );
  }

  ///\b([a-f0-9]{40})\b/
  public static againstSHA1(
    text: string,
    argumentName: string
  ): Result<GuardResponse> {
    return text.match(/\b[0-9a-f]{5,40}\b/)
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `${argumentName} is not a valid SHA-1 hash.`
        );
  }
}
