import { Readable } from "stream";

export class StringReader extends Readable {
  private data: string;
  private position: number;

  constructor(data: string) {
    super();
    this.data = data;
    this.position = 0;
  }

  _read(size: number) {
    if (this.position >= this.data.length) {
      this.push(null); // No more data to push
    } else {
      const chunk = this.data.slice(this.position, this.position + size);
      this.position += size;
      this.push(chunk);
    }
  }
}
