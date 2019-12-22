import { Component, Input } from '@angular/core';

import { DisjunctiveExpression, Expression, Operand } from '@app/models';

@Component({
  selector: 'app-discrete-expression',
  templateUrl: './discrete-expression.component.html',
  host: { class: 'component-wrapper' },
})
export class DiscreteExpressionComponent {

  @Input() public isBooleanBasisMode: boolean = true;
  @Input() public function: Expression;
  @Input() public nested: boolean = false;

  public isOperand(operand: Operand | Expression): operand is Operand {
    return operand instanceof Operand;
  }

  public isDisjunctiveExpression(): boolean {
    return this.function instanceof DisjunctiveExpression;
  }

  public isBracketsShown(): boolean {
    return this.nested
      && !this.isBooleanBasisMode
      && this.function.operands.length > 1;
  }
}