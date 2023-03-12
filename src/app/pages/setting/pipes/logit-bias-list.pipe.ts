import { Pipe, PipeTransform } from '@angular/core';
import { decode } from '@nem035/gpt-3-encoder';


@Pipe({
  name: 'logitBiasList'
})
export class LogitBiasListPipe implements PipeTransform {

  transform(logitBias: { [token: number]: number; } | undefined): Array<{ token: number; text: string; value: number; }> {
    if (!logitBias) {
      return [];
    };
    return Object.entries(logitBias).map(([tokenStr, value]) => {
      const token = parseInt(tokenStr);
      return { token, value, text: decode([token]) };
    });
  }

}
