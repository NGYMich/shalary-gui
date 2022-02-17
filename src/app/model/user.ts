export class User {
  id: number;
  validated: boolean;
  username: string;
  password: string;
  mail: string;
  mainSector: string;
  location: string;
  education: string;
  age: number;
  gender: Gender

  constructor(id: number, validated: boolean, username: string, password: string, mail: string, mainSector: string, location: string, education: string, age: number, gender: Gender) {
    this.id = id;
    this.validated = validated;
    this.username = username;
    this.password = password;
    this.mail = mail;
    this.mainSector = mainSector;
    this.location = location;
    this.education = education;
    this.age = age;
    this.gender = gender;
  }

}

enum Gender {
  MALE, FEMALE
}
