export class Tag {
  tagId: string;
  creatorId: string;
  name: string;
  description: string;

  constructor(
    tagId: string,
    creatorId: string,
    name: string,
    description: string
  ) {
    this.tagId = tagId;
    this.creatorId = creatorId;
    this.name = name;
    this.description = description;
  }
}
