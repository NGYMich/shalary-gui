import {Component, Input} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {commonContractTypes, commonSectors} from "../../common-variables";
import {User} from "../../../../model/user";
import {TokenStorageService} from "../../../../services/TokenStorageService";

@Component({
  selector: 'work-history-form',
  templateUrl: './work-history-form-component.html',
  styleUrls: ['./work-history-form-component.css']
})
export class WorkHistoryFormComponent {
  contractTypes = commonContractTypes
  sectors = commonSectors
  salaryInfosForm: FormGroup;
  @Input() userToModify: User | null = null;
  @Input() isEditUserPage: boolean = true;

  ngOnChanges() {
    this.initSalaryInfosForm();
    this.initWorkHistory();
  }

  constructor(private formBuilder: FormBuilder, private tokenStorageService: TokenStorageService) {
  }

  get salaryInfos(): FormArray {
    return this.salaryInfosForm.get('salaryInfos') as FormArray;
  }


  addNewJobFormLine(copyPastLine: boolean = true, second: boolean = false) {
    let lastSalaryInfo = this.salaryInfos.controls[this.salaryInfos.controls.length - 1]
    let controlsConfig = this.copyLastSalaryInfoForNewJobLine(lastSalaryInfo, copyPastLine, second)
    this.salaryInfos.push(this.formBuilder.group(controlsConfig))
  }

  private copyLastSalaryInfoForNewJobLine(lastSalaryInfo: AbstractControl, copyPastLine: boolean, second: boolean) {

    if (copyPastLine) {
      return {
        yearsOfExperience: new FormControl(lastSalaryInfo.get('yearsOfExperience')?.value, Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
        jobName: new FormControl(lastSalaryInfo.get('jobName')?.value, Validators.required),
        baseSalary: new FormControl(lastSalaryInfo.get('baseSalary')?.value, Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
        stockSalary: new FormControl(lastSalaryInfo.get('stockSalary')?.value),
        bonusSalary: new FormControl(lastSalaryInfo.get('bonusSalary')?.value),
        company: this.formBuilder.group({
          name: new FormControl(lastSalaryInfo.get('company')?.value.name),
          sector: new FormControl(lastSalaryInfo.get('company')?.value.sector)
        }),
        contractType: new FormControl(lastSalaryInfo.get('contractType')?.value)
      }
    }

    if (!second) {
      return {
        yearsOfExperience: new FormControl('2', Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
        jobName: new FormControl('DevOps Engineer', Validators.required),
        baseSalary: new FormControl('40000', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
        stockSalary: new FormControl(''),
        bonusSalary: new FormControl(''),
        company: this.formBuilder.group({
          name: 'Capgemini',
          sector: 'Information Technology'
        }),
        contractType: new FormControl('Full-time')

      };
    }
      return {
        yearsOfExperience: new FormControl('5', Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
        jobName: new FormControl('Intermediate DevOps Engineer', Validators.required),
        baseSalary: new FormControl('55000', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
        stockSalary: new FormControl('2000'),
        bonusSalary: new FormControl('2000'),
        company: this.formBuilder.group({
          name: 'BNP Paribas',
          sector: 'Finance / Banking'
        }),
        contractType: new FormControl('Full-time')

      };



  }

  removeJobFormLine(pointIndex) {
    this.salaryInfos.removeAt(pointIndex);
  }

  async initWorkHistory() {
    if (this.userToModify != null && this.userToModify.salaryHistory == null) {
      this.addNewJobFormLine(false);
      this.addNewJobFormLine(false, true);
      console.log(this.salaryInfos)
    } else  {
      console.log('init work history')
      await this.userToModify
      this.userToModify?.salaryHistory?.salaryInfos?.forEach(
        salaryInfo => this.salaryInfos.push(this.formBuilder.group({
              // id: new FormControl(salaryInfo.id),
              yearsOfExperience: new FormControl(salaryInfo.yearsOfExperience, Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
              jobName: new FormControl(salaryInfo.jobName, Validators.required),
              baseSalary: new FormControl(salaryInfo.baseSalary, Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
              stockSalary: new FormControl(salaryInfo.stockSalary),
              bonusSalary: new FormControl(salaryInfo.bonusSalary),
              company: this.formBuilder.group({
                // id: new FormControl(salaryInfo.company.id),
                name: salaryInfo.company.name,
                sector: salaryInfo.company.sector
              }),
              contractType: new FormControl(salaryInfo.contractType)
            }
          )
        )
      )
    }

  }

  private initSalaryInfosForm() {
    this.salaryInfosForm = this.formBuilder.group({
      salaryInfos: this.formBuilder.array([])
    });
  }
}
