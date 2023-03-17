import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../services/UserService";
import {LocationService} from "../../services/LocationService";
import {Country} from "../../model/country";
import {map, Observable, startWith} from "rxjs";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  users: User[]
  countries: any;
  userCountries: (string | null)[];

  constructor(private userService: UserService, private locationService: LocationService) {
    // this.loadUsers();
    this.loadLocations();
  }

  ngOnInit(): void {
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.userCountries = this.users.map(user => user.location)
      console.log(this.users)
    })
  }


  private loadLocations() {
    this.locationService.getCountriesWithFlags().subscribe((data: Country[]) => {
      let flagsToIgnore = ["Afghanistan"];
      console.log("countries :", data);
      this.userService.getUsers().subscribe((users: User[]) => {
        this.users = users;
        this.userCountries = this.users.map(user => user.location)
        this.countries = data.filter(flag => flag.flag != null && !flagsToIgnore.includes(flag.name) && this.userCountries.includes(flag.name))
        console.log("userCountries :", this.userCountries);

      })

    })
  }
}
