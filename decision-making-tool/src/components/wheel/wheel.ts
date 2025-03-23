import { getRndColorMixCss } from '../../utils/index.ts';
import { Element } from '../base/element.ts';
import type { OptionData } from '../option-list/option-list.ts';
import type { OnSlideChangeHandler, Point, SliceData } from './types.ts';
import { DrawHelper } from './utils/draw-helper.ts';
import {
  createSlicesFromOptions,
  getRndWheelSpeed,
  isCurrentSlice,
  updateSliceAngles,
} from './utils/misc.ts';

import styles from './wheel.module.scss';

export const NEEDLE_RADIUS_RATIO = 0.15;
const CANVAS_PADDING = 30;
const WHEEL_DEFAULT_RADIUS = 250;

const ERR_INVALID_CONTEXT =
  'The context id is not supported, or the canvas has already been set to a different context mode';

type Props = {
  options: OptionData[];
  totalWeight: number;
  radius?: number;
  duration?: number;
};

export class Wheel extends Element<HTMLCanvasElement> {
  private _radius: number = 0;
  private context: CanvasRenderingContext2D;
  private drawHelper: DrawHelper;
  private slices: SliceData[] = [];
  private _onFinish: OnSlideChangeHandler = null;
  private _onChange: OnSlideChangeHandler = null;
  private _currentSlice: SliceData | null = null;
  private _abort = false;

  constructor({ options, totalWeight, radius = WHEEL_DEFAULT_RADIUS }: Props) {
    super({ tag: 'canvas', className: styles.canvas });

    this.radius = radius;
    this.context = this.getContext2D();
    this.drawHelper = new DrawHelper(this, this.context);
    this.slices = createSlicesFromOptions(options, totalWeight);

    this.draw();
  }

  public get currentSlice(): SliceData | null {
    return this._currentSlice;
  }

  public get radius(): number {
    return this._radius;
  }

  public get center(): Point {
    return {
      x: this.node.width / 2,
      y: this.node.height / 2,
    };
  }

  public get needleRadius(): number {
    return this.radius * NEEDLE_RADIUS_RATIO;
  }

  public set radius(v: number) {
    this.node.width = v * 2 + CANVAS_PADDING;
    this.node.height = v * 2 + CANVAS_PADDING;
    this._radius = v;
  }

  public set onFinish(handler: OnSlideChangeHandler) {
    this._onFinish = handler;
  }

  public set onChange(handler: OnSlideChangeHandler) {
    this._onChange = handler;
  }

  public stop(): void {
    this._abort = true;
  }

  public spin(durationSecs: number): void {
    const startTime = performance.now();
    const speed = getRndWheelSpeed();
    let rafId: number;
    let angle = 0;

    const durationMs = durationSecs * 1000;

    const animate = (): void => {
      const elapsed = performance.now() - startTime;

      angle += speed * (elapsed >= durationMs / 2 ? -1 : 1);
      // In case you switched tabs - the speed of Raf callback may be reduced
      angle = angle < 0 ? 0 : angle;

      if (elapsed >= durationMs || this._abort) {
        cancelAnimationFrame(rafId);
        if (!this._abort) {
          this._onFinish?.(this.currentSlice);
        }
        this._abort = false;

        return;
      }
      this.draw(angle);

      rafId = requestAnimationFrame(animate);
    };

    animate();
  }

  public repaint(): void {
    const { drawHelper } = this;

    this.clearCanvas();
    drawHelper.createBaseCircle();

    for (const slice of this.slices) {
      slice.color = getRndColorMixCss();
      drawHelper.createSlice(slice);
    }
    drawHelper.createNeedle();
    drawHelper.createCursor();
  }

  private draw(angleDeltaRad: number = 0): void {
    const { drawHelper } = this;

    this.clearCanvas();
    drawHelper.createBaseCircle();

    for (const slice of this.slices) {
      updateSliceAngles(slice, angleDeltaRad);

      if (isCurrentSlice(slice)) {
        this._currentSlice = slice;
        this._onChange?.(slice);
      }
      drawHelper.createSlice(slice);
    }
    drawHelper.createNeedle();
    drawHelper.createCursor();
  }

  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.node.width, this.node.height);
  }

  private getContext2D(): CanvasRenderingContext2D {
    const context = this.node.getContext('2d');
    if (!context) {
      throw Error(ERR_INVALID_CONTEXT);
    }
    return context;
  }
}
