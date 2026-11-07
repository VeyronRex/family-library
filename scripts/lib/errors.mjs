// An error that carries a list of plain-language problems for the person
// writing the site (not for programmers).
export class FriendlyError extends Error {
  constructor(problems) {
    const list = [].concat(problems);
    super(list.join('\n'));
    this.problems = list;
  }
}
