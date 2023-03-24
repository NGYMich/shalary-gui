import {Component, Input} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {commonContractTypes, commonSectors} from "../../common-variables";
import {User} from "../../../../model/user";

@Component({
  selector: 'app-work-history-form-component',
  templateUrl: './work-history-form-component.html',
  styleUrls: ['./work-history-form-component.css']
})
export class WorkHistoryFormComponent {
  contractTypes = commonContractTypes
  sectors = commonSectors
  salaryInfosForm: FormGroup;
  @Input() userToModify: User | null = null;
  @Input() isEditUserPage: boolean = true;

  ngOnInit() {
    this.initSalaryInfosForm();
    this.initWorkHistory();
  }

  ngOnChanges() {
  }

  constructor(private formBuilder: FormBuilder) {
  }

  get salaryInfos(): FormArray {
    return this.salaryInfosForm.get('salaryInfos') as FormArray;
  }


  addNewJobFormLine(copyPastLine: boolean = false) {
    let lastSalaryInfo = this.salaryInfos.controls[this.salaryInfos.controls.length - 1]
    let controlsConfig = this.copyLastSalaryInfoForNewJobLine(lastSalaryInfo, copyPastLine)
    this.salaryInfos.push(this.formBuilder.group(controlsConfig))
  }

  private copyLastSalaryInfoForNewJobLine(lastSalaryInfo: AbstractControl, copyPastLine: boolean) {

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
    return {
      yearsOfExperience: new FormControl('2', Validators.compose([Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.required])),
      jobName: new FormControl('DevOps Engineer', Validators.required),
      baseSalary: new FormControl('20000', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),])),
      stockSalary: new FormControl(''),
      bonusSalary: new FormControl(''),
      company: this.formBuilder.group({
        name: 'Capgemini',
        sector: 'Information Technology'
      }),
      contractType: new FormControl('')

    };
  }

  removeJobFormLine(pointIndex) {
    this.salaryInfos.removeAt(pointIndex);
  }

  async initWorkHistory() {
    if (!this.isEditUserPage) {
      console.log('added new job form line')
      this.addNewJobFormLine();
      this.addNewJobFormLine();
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
