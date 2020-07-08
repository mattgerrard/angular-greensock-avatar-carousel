import {AfterViewInit, Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {gsap, Sine} from 'gsap';

enum Direction {
  Left = '-=',
  Right = '+='
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public currentAvatarIndex = 1;

  public enableCarouselButtons = true;

  private readonly inactiveProperties = {
    filter: 'grayscale(100%)',
    scale: 0.5,
    opacity: 0.3
  }

  @ViewChildren('carouselItem')
  private carouselItems : QueryList<ElementRef>;

  ngAfterViewInit(): void {
    const carouselNativeElements = this.getCarouselElements();
    const currentLeftAvatar = carouselNativeElements[0];
    const currentRightAvatar = carouselNativeElements[2];
    gsap.set([currentLeftAvatar, currentRightAvatar], this.inactiveProperties);
  }

  public right(): void {
    this.slide(Direction.Right);
  }

  public left(): void {
    this.slide(Direction.Right);
  }

  private slide(direction: Direction): void {
    this.enableCarouselButtons = false;

    const carouselNativeElements = this.getCarouselElements();
    const currentLeftAvatarIndex = this.getPreviousIndex(this.currentAvatarIndex);
    const currentRightAvatarIndex = this.getNextIndex(this.currentAvatarIndex);

    const currentLeftAvatar = carouselNativeElements[currentLeftAvatarIndex];
    const currentCentralAvatar = carouselNativeElements[this.currentAvatarIndex];
    const currentRightAvatar = carouselNativeElements[currentRightAvatarIndex];

    let moveAcrossBackAvatar;
    let moveAcrossBackDirection;
    let moveToSideDirection;
    let moveToCenterAvatar;
    let moveToCenterDirection;
    const moveToSideAvatar = currentCentralAvatar;

    let nextAvatarIndex;

    if (direction === Direction.Right) {
      moveAcrossBackAvatar = currentLeftAvatar;
      moveAcrossBackDirection = Direction.Right;
      moveToSideDirection = Direction.Left;
      moveToCenterAvatar = currentRightAvatar;
      moveToCenterDirection = Direction.Left;
      nextAvatarIndex = currentRightAvatarIndex;
    } else {
      moveAcrossBackAvatar = currentRightAvatar;
      moveAcrossBackDirection = Direction.Left;
      moveToSideDirection = Direction.Right;
      moveToCenterAvatar = currentLeftAvatar;
      moveToCenterDirection = Direction.Right;
      nextAvatarIndex = currentLeftAvatarIndex;
    }

    gsap.timeline({ repeat: 0})
      .to([moveToSideAvatar], {
        ...this.inactiveProperties,
        duration: 1,
        ease: Sine.easeInOut,
        x: moveToSideDirection + '100%'
      }).to([moveAcrossBackAvatar], {
        ...this.inactiveProperties,
        delay: -1,
        duration: 1,
        ease: Sine.easeInOut,
        x: moveAcrossBackDirection + '200%'
      }).to([moveToCenterAvatar], {
        filter: 'none',
        scale: 1.0,
        opacity: 1.0,
        delay: -1,
        duration: 1,
        ease: Sine.easeInOut,
        x: moveToCenterDirection + '100%'
      }).eventCallback('onComplete', () => {
        this.enableCarouselButtons = true;
        this.currentAvatarIndex = nextAvatarIndex;
      });
  }

  private getNextIndex(index: number): number {
    return ((index + 1) % this.carouselItems.length);
  }

  private getPreviousIndex(index: number) {
    return ((index + this.carouselItems.length - 1)
      % this.carouselItems.length);
  }

  private getCarouselElements(): any[] {
    return this.carouselItems.toArray().map(el => el.nativeElement)
  }
}
