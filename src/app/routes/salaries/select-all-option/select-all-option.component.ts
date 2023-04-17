import { ChangeDetectorRef, Component, ElementRef, HostListener, HostBinding, Inject, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_OPTION_PARENT_COMPONENT, MatOptgroup, MatOption, MatOptionParentComponent } from '@angular/material/core';
import { AbstractControl } from '@angular/forms';
import { MatPseudoCheckboxState } from '@angular/material/core/selection/pseudo-checkbox/pseudo-checkbox';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-select-all-option',
  templateUrl: './select-all-option.component.html',
  styleUrls: ['./select-all-option.component.css']
})
export class SelectAllOptionComponent extends MatOption implements OnInit, OnDestroy {
  protected unsubscribe: Subject<any>;

  @Input() control: AbstractControl;
  @Input() title: string;
  @Input() values: any[] = [];

  @HostBinding('class') cssClass = 'mat-option';

  @HostListener('click') toggleSelection(): void {
    // this. _selectViaInteraction();

    this.control.setValue(this.selected ? this.values : []);
  }

  constructor(elementRef: ElementRef<HTMLElement>,
              changeDetectorRef: ChangeDetectorRef,
              @Optional() @Inject(MAT_OPTION_PARENT_COMPONENT) parent: MatOptionParentComponent,
              @Optional() group: MatOptgroup) {
    super(elementRef, changeDetectorRef, parent, group);

    this.title = 'Select All';
  }

  ngOnInit(): void {
    this.unsubscribe = new Subject<any>();

    this.refresh();

    this.control.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.refresh();
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  get selectedItemsCount(): number {
    return this.control && Array.isArray(this.control.value) ? this.control.value.filter(el => el !== null).length : 0;
  }

  get selectedAll(): boolean {
    return this.selectedItemsCount === this.values?.length;
  }

  get selectedPartially(): boolean {
    const selectedItemsCount = this.selectedItemsCount;

    return selectedItemsCount > 0 && selectedItemsCount < this.values.length;
  }

  get checkboxState(): MatPseudoCheckboxState {
    let state: MatPseudoCheckboxState = 'unchecked';

    if (this.selectedAll) {
      state = 'checked';
    } else if (this.selectedPartially) {
      state = 'indeterminate';
    }

    return state;
  }

  refresh(): void {
    if (this.selectedItemsCount > 0) {
      this.select();
    } else {
      this.deselect();
    }
  }
}
