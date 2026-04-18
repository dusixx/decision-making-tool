import { getRndColorMixCss } from '@common';
import type { OptionData } from '@components';
import { Element } from '@components';
import {
  createSlicesFromOptions,
  DrawHelper,
  easeOutCubic,
  isCurrentSlice,
  PI2,
  updateSliceAngles,
} from './utils';
import styles from './wheel.module.scss';
import type { OnSlideChangeHandler, Point, SliceData } from './wheel.types.ts';

export const NEEDLE_RADIUS_RATIO = 0.15;
const CANVAS_PADDING = 30;
const WHEEL_DEFAULT_RADIUS = 250;
const MIN_TURNS_COUNT = 5;

const ERR_INVALID_CONTEXT =
  'The context id is not supported, or the canvas has already been set to a different context mode';

type Props = {
  options: OptionData[];
  totalWeight: number;
  radius?: number;
  duration?: number;
};

export class Wheel extends Element<HTMLCanvasElement> {
  public onFinish: OnSlideChangeHandler = null;
  public onDraw: OnSlideChangeHandler = null;
  public onChange: OnSlideChangeHandler = null;
  public currentSlice: SliceData | null = null;

  private _radius: number = 0;
  private context: CanvasRenderingContext2D;
  private drawHelper: DrawHelper;
  private slices: SliceData[] = [];
  private _abort = false;

  constructor({ options, totalWeight, radius = WHEEL_DEFAULT_RADIUS }: Props) {
    super({ tag: 'canvas', className: styles.canvas });

    this.radius = radius;
    this.context = this.getContext2D();
    this.drawHelper = new DrawHelper(this, this.context);

    this.slices = createSlicesFromOptions(options, totalWeight);

    this.draw();
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

  public stop(): void {
    this._abort = true;
  }

  public spin(durationSecs: number): void {
    const startTime = performance.now();
    const durationMs = durationSecs * 1000;
    const randomDelta = Math.random() * PI2;
    const turnsCount = Math.max(Math.ceil(durationSecs / 2), MIN_TURNS_COUNT);
    const spinAngle = turnsCount * PI2 + randomDelta;

    const animate = (): void => {
      const elapsed = performance.now() - startTime;
      const progress = elapsed / durationMs;
      const startAngle = spinAngle * easeOutCubic(progress);

      if (progress >= 1 || this._abort) {
        if (!this._abort) {
          this.onFinish?.(this.currentSlice);
        }
        this._abort = false;

        return;
      }
      this.draw(startAngle);
      requestAnimationFrame(animate);
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

  private draw(startAngleRad: number = 0): void {
    const { drawHelper } = this;

    this.clearCanvas();
    drawHelper.createBaseCircle();

    for (const slice of this.slices) {
      updateSliceAngles(slice, startAngleRad);

      if (isCurrentSlice(slice)) {
        if (this.currentSlice !== slice) {
          this.onChange?.(slice);
        }
        this.currentSlice = slice;
        this.onDraw?.(slice);
      }
      drawHelper.createSlice(slice);

      startAngleRad = slice.endAngleRad;
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
