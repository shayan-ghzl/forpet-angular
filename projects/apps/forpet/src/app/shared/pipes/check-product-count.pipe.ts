import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/api-models';

@Pipe({
  name: 'checkProductCount'
})
export class CheckProductCountPipe implements PipeTransform {

  transform(productId: string, ordersList: Product[]): number {
    return ordersList.find(p => p.id === productId)?.count || 0;
  }

}
