export class User {
  constructor({ id, email, name }) {
    this.id = id || null;
    this.email = email;
    this.name = name;
  }
}
