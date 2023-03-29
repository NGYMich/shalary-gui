
export class Article {

  headerName: string | null;
  subHeaderName: string | null;
  description: string | null;

  constructor(headerName: string, subHeaderName: string, description: string) {
    this.headerName = headerName
    this.subHeaderName = subHeaderName;
    this.description = description;
  }
}
