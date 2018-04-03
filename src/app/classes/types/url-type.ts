export class UrlType {

  constructor(
    urlTypeId: string,
    name: string,
    description: string
  ) {
    this.urlTypeId = urlTypeId;
    this.name = name;
    this.description = description;
  }
  urlTypeId: string;
  name: string;
  description: string;

}
