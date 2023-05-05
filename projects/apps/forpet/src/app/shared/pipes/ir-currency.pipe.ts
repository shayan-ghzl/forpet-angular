import { Pipe, PipeTransform } from '@angular/core';

enum IRCurrencies {
  RIAL = 'ریال',
  R = 'ریال',
  TOMAN = 'تومان',
  T = 'تومان'
}

@Pipe({
  name: 'irCurrency'
})
export class IrCurrencyPipe implements PipeTransform {

  transform(value: number | string | null | undefined, type: keyof typeof IRCurrencies = 'RIAL' as keyof typeof IRCurrencies): string {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      throw new Error(`NaN is not a acceptable number`);
    }
    return `${numericValue.toLocaleString('en-US')} ${IRCurrencies[type]}`;
  }

}
