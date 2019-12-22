import { BaseFsmCoder } from './base-fsm-coder';
import { ConjunctiveExpression, DisjunctiveExpression, Expression } from '../expressions';
import { ITableRow, TFunctionMap } from '@app/types';
import { SignalOperand } from '../operands';

export class MiliCoder extends BaseFsmCoder {

  public getOutputBooleanFunctions(tableData: ITableRow[]): TFunctionMap {
    const outputBooleanFunctions: TFunctionMap = new Map();

    tableData
      .filter((tableRow: ITableRow) => tableRow.y.size > 0)
      .forEach((tableRow: ITableRow) => {
        const stateOperand: SignalOperand = tableRow.srcState as SignalOperand;

        let conditionalExpression: Expression;

        if (!tableRow.unconditionalX) {
          conditionalExpression = new ConjunctiveExpression([stateOperand]);

          tableRow.x.forEach((conditionalSignal: SignalOperand) => {
            conditionalExpression.addOperand(conditionalSignal);
          });
        }

        tableRow.y.forEach((y: number) => {
          if (!outputBooleanFunctions.has(y)) {
            outputBooleanFunctions.set(y, new DisjunctiveExpression([]));
          }

          const outputBooleanFunction = outputBooleanFunctions.get(y) as Expression;

          if (conditionalExpression) {
            outputBooleanFunction.addOperand(conditionalExpression);
          } else if (!outputBooleanFunction.hasOperand(stateOperand)) {
            outputBooleanFunction.addOperand(stateOperand);
          }
        });
      });

    return outputBooleanFunctions;
  }
}