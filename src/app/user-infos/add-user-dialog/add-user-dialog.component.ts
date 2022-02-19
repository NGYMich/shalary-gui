import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/UserService";
import {User} from "../../model/user";
import {Company} from "../../model/salaryInfo";

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
  }

  get jobs(): FormArray {
    return this.jobHistoryForm.get('jobs') as FormArray;
  }

  userInformationsForm: FormGroup;
  jobHistoryForm: FormGroup;
  jobLevels = ['Intern', 'Apprentice', 'Junior', 'Intermediate', 'Senior'];
  selectedJobLevel;
  selectedGender;
  isUserAdded: boolean;

  ngOnInit(): void {
    this.jobHistoryForm = this.formBuilder.group({
      jobs: this.formBuilder.array([])
    });


    this.userInformationsForm = this.formBuilder.group({
      username: new FormControl(''),
      password: new FormControl(''),
      mail: new FormControl(''),
      mainSector: new FormControl(''),
      location: new FormControl(''),
      education: new FormControl('', Validators.pattern('^[0-9]*$')),
      age: new FormControl(''),
      gender: new FormControl(''),
      jobName: new FormControl(''),
      jobLevel: new FormControl(''),
    });
  }

  addUser($event: MouseEvent) {
    const user: User = {
      id: null,
      validated: true,
      username: this.userInformationsForm.get('username')!.value,
      password: this.userInformationsForm.get('password')!.value,
      mail: this.userInformationsForm.get('mail')!.value,
      mainSector: this.userInformationsForm.get('mainSector')!.value,
      location: this.userInformationsForm.get('location')!.value,
      education: this.userInformationsForm.get('education')!.value,
      age: this.userInformationsForm.get('age')!.value,
      gender: this.userInformationsForm.get('gender')!.value,
      salaryHistory: this.jobs.value,
    };
    this.userService.addUser(user);
  }

  addJob() {
    this.jobs.push(this.formBuilder.group({
        yearsOfExperience: '',
        jobLevel: '',
        jobName: '',
        baseSalary: '',
        stockSalary: '',
        bonusSalary: '',
        totalSalary: '',
        company: '',
        }
      )
    );
  }

  removeJob(pointIndex) {
    this.jobs.removeAt(pointIndex);
  }
}
