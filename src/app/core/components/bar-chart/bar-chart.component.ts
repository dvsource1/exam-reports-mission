import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

export interface ChartBlock {
  name: string;
  color: string;
  value: number;
  percentage?: number;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.sass'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class BarChartComponent implements OnChanges {
  @Input() blocks: ChartBlock[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('blocks' in changes) {
      const sum = this.blocks.reduce((i, a) => i + a.value, 0);
      this.blocks = this.blocks.map((block) => {
        return {
          ...block,
          percentage: +((block.value * 100) / sum).toFixed(2),
        };
      });
    }
  }
}
