export class tokenizer {
  tokens: token[] = [];
  constructor(
    public source: string,
    public current: number = 0,
  ) {}

  atEnd(): boolean {
    return this.current >= this.source.length;
  }

  peek(): string {
    if (this.atEnd()) {
      return "\0";
    }
    return this.source[this.current];
  }

  advance(): string {
    return this.source[this.current++];
  }

  isAlpha(s: string): boolean {
    return "a" <= s && "z" >= s && "A" <= s && "Z" >= s;
  }

  makeLinkToken() {
    const link: token = { type: token_type.link, value: "", url: "" };
    if (this.peek() === ":") {
      link.value = "here";
      this.advance(); //consume the second :
      while (!this.atEnd() && this.peek() !== ":") {
        link.url += this.advance();
      }
      this.advance(); //consume the last :
    } else {
      while (!this.atEnd() && this.peek() !== ":") {
        link.value += this.advance();
      }
      this.advance(); //consume the second :
      while (!this.atEnd() && this.peek() !== ":") {
        link.url += this.advance();
      }
      this.advance(); //consume the last :
    }
    this.tokens.push(link);
  }

  tokenize(): token[] {
    let currentToken: token = { type: token_type.text, value: "", url: "" };
    while (!this.atEnd()) {
      const char = this.advance();
      if (char === ":" && (this.isAlpha(this.peek()) || this.peek() === ":")) {
        this.tokens.push(currentToken);
        this.makeLinkToken();
        currentToken = { type: token_type.text, value: "", url: "" };
      } else {
        currentToken.value += char;
      }
    }
    return this.tokens;
  }
}

export enum token_type {
  text,
  link,
}

interface token {
  type: token_type;
  value: string;
  url: string;
}
