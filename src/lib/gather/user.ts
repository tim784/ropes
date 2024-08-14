export function getUserUrl(id: string): string {
  return `/user.php?id=${id}`;
}

export class User {
  constructor(
    public name: string,
    public id: string
  ) {}

  static fromNameAndHref(name: string, href: string): User {
    const url = new URL(href, window.location.href);

    const id = url.searchParams.get('id');
    if (!id) {
      throw new Error(`User href missing id: ${href}`);
    }

    return new User(name, id);
  }

  get href(): string {
    return getUserUrl(this.id);
  }
}
