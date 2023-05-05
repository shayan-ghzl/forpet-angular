import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {


  scrollTop() {
    document.body.scrollTop = 0;
    // Firefox
    document.documentElement.scrollTop = 0;
    // Mobile safari
    window.scrollTo(0, 0);
  }

}
