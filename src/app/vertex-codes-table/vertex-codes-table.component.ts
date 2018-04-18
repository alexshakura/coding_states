import { Component, OnInit, ViewEncapsulation, state, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TableDataService } from '../services/table-data.service';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';

import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-vertex-codes-table',
  templateUrl: './vertex-codes-table.component.html',
  styleUrls: ['./vertex-codes-table.component.scss'],
  host: { class: 'component-wrapper' }
})
export class VertexCodesTableComponent implements OnInit, OnDestroy {

  public readonly displayedColumns: string[] = ['id', 'code'];

  public dataSource: MatTableDataSource<{ id: number, code: number }> = new MatTableDataSource();
  public bitCapacity: number;

  public triggerMode: string;

  private _destroy$$: Subject<void> = new Subject<void>();

  public constructor(
    private _tableDataService: TableDataService,
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) { }

  public ngOnInit(): void {
    this._codingAlgorithmsService.vertexCodes$
      .takeUntil(this._destroy$$)
      .subscribe((vertexCodes: App.TVertexData) => {
        const newData = [];

        vertexCodes.forEach((value, key) => newData.push({ id: key, code: value }));

        this.dataSource.data = newData;
        this.bitCapacity = vertexCodes.size;
      });

    this._codingAlgorithmsService.triggerMode$
      .takeUntil(this._destroy$$)
      .subscribe((triggerMode: string) => {
        this.triggerMode = triggerMode;
      });
  }

  public ngOnDestroy(): void {
    this._destroy$$.next();
    this._destroy$$.complete();
  }

  public formatStateCode(stateCode: number): string {
    return this._tableDataService.formatStateCode(stateCode, this.bitCapacity);
  }

  public isTriggerModeD(): boolean {
    return this.triggerMode === CodingAlgorithmsService.D_TRIGGER_MODE;
  }
}
