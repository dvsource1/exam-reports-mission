import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentDate',
})
export class MomentDatePipe implements PipeTransform {
  transform(
    value: string,
    sourceFormat: string,
    targetFormat: string
  ): unknown {
    return moment(value, sourceFormat).format(targetFormat);
  }
}
