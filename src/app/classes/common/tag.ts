export class Tag {
  tagId: string;
  creatorId: string;
  name: string;
  description: string;

  constructor(
    creatorId: string,
    name: string,
    description: string
  ) {
    this.creatorId = creatorId;
    this.name = name;
    this.description = description;
  }
}
