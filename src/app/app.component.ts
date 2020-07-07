import {Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {gsap, Sine} from 'gsap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChildren('carouselItem')
  private carouselItems : QueryList<ElementRef>;

  public right(): void {
    const carouselNativeElements = this.carouselItems.toArray().map(el => el.nativeElement);
    const leftElement = carouselNativeElements[0];
    const centerElement = carouselNativeElements[1];
    const rightElement = carouselNativeElements[2];

    gsap.timeline({ repeat: 0})
      .to([centerElement], {
        duration: 1,
        ease: Sine.easeInOut,
        x: '+=100%'
      }).to([rightElement], {
        delay: -1,
        duration: 1,
        ease: Sine.easeInOut,
        x: '-=200%'
      }).to([leftElement], {
        delay: -1,
        duration: 1,
        ease: Sine.easeInOut,
        x: '+=100%'
      });
  }
}
