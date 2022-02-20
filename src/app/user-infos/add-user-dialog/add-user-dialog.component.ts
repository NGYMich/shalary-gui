import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/UserService";
import {User} from "../../model/user";

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
  }

  userInformationsForm: FormGroup;
  salaryInfosForm: FormGroup;
  salaryHistoryForm: FormGroup;
  jobLevels = ['Intern', 'Apprentice', 'Junior', 'Intermediate', 'Senior'];
  currencies = ['€', '$', '£', '¥', 'CHF'];
  selectedJobLevel;
  selectedGender;
  selectedCurrency;

  isUserAdded: boolean;
  test: any;

  ngOnInit(): void {
    this.initSalaryInfosForm();
    this.initUserInformationsForm();
  }


  addUser($event: MouseEvent) {
    this.userService.addUser({
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
      salaryHistory: {
        id: null,
        salaryCurrency: this.userInformationsForm.get('currency')!.value,
        totalYearsOfExperience: this.userInformationsForm.get('yearsOfExperience')!.value,
        salaryInfos: this.salaryInfos.value
      }
    });
  }

  addNewJobFormLine() {
    this.salaryInfos.push(this.formBuilder.group({
          yearsOfExperience: '',
          jobLevel: '',
          jobName: '',
          baseSalary: '',
          stockSalary: '',
          bonusSalary: '',
          totalSalary: '',
          company: this.formBuilder.group({name: ''}),
        }
      )
    );
  }

  removeJobFormLine(pointIndex) {
    this.salaryInfos.removeAt(pointIndex);
  }


  calculateTotalSalary(pointIndex) {
    let totalSalary: number = 0;
    let currentJob = this.salaryInfos.value[pointIndex]!;
    if (currentJob.baseSalary == '' && currentJob.bonusSalary == '' && currentJob.bonusSalary == '') {
      return 'Total Salary'
    } else {
      if (currentJob.baseSalary !== '') totalSalary += parseFloat(currentJob.baseSalary);
      if (currentJob.bonusSalary !== '') totalSalary += parseFloat(currentJob.bonusSalary);
      if (currentJob.stockSalary !== '') totalSalary += parseFloat(currentJob.stockSalary);
    }
    return totalSalary
  }

  // getters & setters
  get salaryInfos(): FormArray {
    return this.salaryInfosForm.get('salaryInfos') as FormArray;
  }

  // form initializers

  private initUserInformationsForm() {
    this.userInformationsForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      mail: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
      yearsOfExperience: new FormControl('', Validators.required),
      mainSector: new FormControl(''),
      location: new FormControl(''),
      education: new FormControl(''),
      age: new FormControl('', Validators.pattern('^[0-9]*$')),
      gender: new FormControl(''),
    });
  }

  private initSalaryHistoryForm() {
    this.salaryHistoryForm = this.formBuilder.group({
      salaryCurrency: '',
      totalYearsOfExperience: '',
      salaryInfos: this.salaryInfos.value

    })
  }

  private initSalaryInfosForm() {
    this.salaryInfosForm = this.formBuilder.group({
      salaryInfos: this.formBuilder.array([])
    });
  }

}
