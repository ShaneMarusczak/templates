export class tokenizer {
  tokens: token[] = [];
  constructor(
    public source: string,
    public current: number = 0,
  ) {}

  atEnd(num = 0): boolean {
    return this.current + num >= this.source.length;
  }

  peek(): string {
    if (this.atEnd()) {
      return "\0";
    }
    return this.source[this.current];
  }

  peekNext(): string {
    if (this.atEnd() || this.atEnd(1)) {
      return "\0";
    }
    return this.source[this.current + 1];
  }

  advance(): string {
    return this.source[this.current++];
  }

  isAlpha(ch: string): boolean {
    return ch.length === 1 &&
      (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
  }

  makeLinkToken() {
    const link: token = { type: token_type.link, value: "", url: "" };
    if (this.peek() === ":") {
      link.value = "here";
      this.advance(); //consume the second :
      while (!this.atEnd()) {
        if (this.peek() === ":" && this.peekNext() !== "/") {
          break;
        }
        link.url += this.advance();
      }
      this.advance(); //consume the last :
    } else {
      while (!this.atEnd() && this.peek() !== ":") {
        link.value += this.advance();
      }
      this.advance(); //consume the second :
      while (!this.atEnd()) {
        if (this.peek() === ":" && this.peekNext() !== "/") {
          break;
        }
        link.url += this.advance();
      }
      this.advance(); //consume the last :
    }
    this.tokens.push(link);
  }

  tokenize(): token[] {
    let currentText = "";
    while (!this.atEnd()) {
      const char = this.advance();
      if (char === ":" && (this.isAlpha(this.peek()) || this.peek() === ":")) {
        this.tokens.push({
          type: token_type.text,
          value: currentText,
          url: "",
        });
        this.makeLinkToken();
        currentText = "";
      } else {
        currentText += char;
      }
    }
    this.tokens.push({
      type: token_type.text,
      value: currentText,
      url: "",
    });

    // TODO : add these to d
    return this.tokens;
  }
}

export enum token_type {
  text,
  link,
}

export interface token {
  type: token_type;
  value: string;
  url: string;
}
