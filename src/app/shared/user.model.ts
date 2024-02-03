export class User {
    firstname: string;
    lastname: string;
    email: string;
    password: string;

    constructor(firsname: string, lastname: string,  email: string,  password: string) {
        this.firstname = firsname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
  }
  