import {Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {gsap, Sine} from 'gsap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public currentAvatarIndex = 1;

  @ViewChildren('carouselItem')
  private carouselItems : QueryList<ElementRef>;

  public right(): void {
    const nextIndex = this.getPreviousIndex(this.currentAvatarIndex);

    const carouselNativeElements = this.carouselItems.toArray().map(el => el.nativeElement);
    const moveToCenterElement = carouselNativeElements[nextIndex];
    const moveToRightElement = carouselNativeElements[this.currentAvatarIndex];
    const moveToLeftElement = carouselNativeElements[this.getNextIndex(this.currentAvatarIndex)];

    gsap.timeline({ repeat: 0})
      .to([moveToRightElement], {
        duration: 1,
        ease: Sine.easeInOut,
        x: '+=100%'
      }).to([moveToLeftElement], {
        delay: -1,
        duration: 1,
        ease: Sine.easeInOut,
        x: '-=200%'
      }).to([moveToCenterElement], {
        delay: -1,
        duration: 1,
        ease: Sine.easeInOut,
        x: '+=100%'
      }).eventCallback('onComplete', () => {
        this.currentAvatarIndex = nextIndex;
      });
  }

  private getNextIndex(index: number): number {
    return ((index + 1) % this.carouselItems.length);
  }

  private getPreviousIndex(index: number) {
    return ((index + this.carouselItems.length - 1)
      % this.carouselItems.length);
  }
}
