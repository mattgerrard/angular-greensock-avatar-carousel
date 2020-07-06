import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChildren,
  QueryList
} from '@angular/core';
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

  public enableCarouselButtons = false;

  public currentAvatarIndex = 1;

  private readonly inactiveProperties = {
    filter: 'grayscale(100%)',
    opacity: 0.3,
    scale: 0.5
  };

  @ViewChildren('carouselItem')
  private carouselItems : QueryList<ElementRef>;

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.enableCarouselButtons = true);
    const nativeCarouselItems = this.getCarouselElements();
    gsap.set([nativeCarouselItems[0], nativeCarouselItems[2]], this.inactiveProperties);
    gsap.set(nativeCarouselItems[1], {
      opacity: 1.0
    });
  }

  left() {
    this.spinCarousel(Direction.Left);
  }

  right() {
    this.spinCarousel(Direction.Right);
  }

  private spinCarousel(direction: Direction) {
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

    const timeline = gsap.timeline({ repeat: 0});
    timeline.set([moveAcrossBackAvatar], {
      zIndex: 0
    }).set([moveToCenterAvatar, moveToSideAvatar], {
      zIndex: 100
    }).to([moveToSideAvatar], {
      x: moveToSideDirection + '100%',
      ...this.inactiveProperties,
      ease: Sine.easeInOut,
      duration: 1
    }).to(moveAcrossBackAvatar, {
      x: moveAcrossBackDirection + '200%',
      duration: 1,
      delay: -1,
      ease: Sine.easeInOut,
    }).to(moveToCenterAvatar, {
      x: moveToCenterDirection + '100%',
      scale: 1,
      filter: 'none',
      ease: Sine.easeInOut,
      duration: 1,
      delay: -1,
      opacity: 1,
    }).eventCallback('onComplete', () => {
      this.enableCarouselButtons = true;
      this.currentAvatarIndex = nextAvatarIndex;
    });
  }

  private getPreviousIndex(index: number) {
    return ((index + this.carouselItems.length - 1)
      % this.carouselItems.length);
  }

  private getNextIndex(index: number): number {
    return ((index + 1) % this.carouselItems.length);
  }

  private getCarouselElements(): any[] {
    return this.carouselItems.toArray().map(el => el.nativeElement)
  }
}
