import { getRndColorMixCss } from '../../utils/index.ts';
import { Element } from '../base/element.ts';
import type { OptionData } from '../option-list/option-list.ts';
import {
  PI2,
  createSlicesFromOptions,
  getRndWheelSpeed,
  isCurrentSlice,
  updateSliceAngles,
} from './utils/misc.ts';

import styles from './wheel.module.scss';

const CANVAS_PADDING = 30;
const LINE_WIDTH = 1.5;
const STROKE_COLOR = 'white';

const NEEDLE_RADIUS_RATIO = 0.15;
const NEEDLE_COLOR = 'white';

const WHEEL_DEFAULT_RADIUS = 250;

const CURSOR_COLOR = 'rgb(206, 20, 104)';
const CURSOR_LINE_WIDTH = 1.5;
const SHADOW_BLUR = 4;
const SHADOW_COLOR = 'rgb(170 170 170)';

const SLICE_TEXT_NEEDLE_OFFSET = 25;
const SLICE_TEXT_VISIBILITY_ANGLE_THRESHOLD = 0.27;
const SLICE_TEXT_COLOR = 'rgb(40 40 40)';
const SLICE_TEXT_FONT = '16px sans-serif';
const SLICE_TEXT_BASELINE = 'middle';

const ERR_INVALID_CONTEXT =
  'The context id is not supported, or the canvas has already been set to a different context mode';

export type SliceData = OptionData & {
  startAngleRad: number;
  endAngleRad: number;
  color: string;
  sliceText: string;
};

type Point = { x: number; y: number };

type OnSlideChangeHandler = ((currentSlice: SliceData | null) => void) | null;

type Props = {
  options: OptionData[];
  totalWeight: number;
  radius?: number;
  duration?: number;
};

export class Wheel extends Element<HTMLCanvasElement> {
  private context: CanvasRenderingContext2D;
  private slices: SliceData[] = [];
  private _radius: number = 0;
  private _onFinish: OnSlideChangeHandler = null;
  private _onChange: OnSlideChangeHandler = null;
  private _currentSlice: SliceData | null = null;
  private _abort = false;

  constructor({ options, totalWeight, radius = WHEEL_DEFAULT_RADIUS }: Props) {
    super({ tag: 'canvas', className: styles.canvas });

    this.radius = radius;
    this.context = this.getContext2D();
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
    this.clearCanvas();
    this.createBaseCircle();

    for (const slice of this.slices) {
      slice.color = getRndColorMixCss();
      this.createSlice(slice);
    }
    this.createNeedle();
    this.createCursor();
  }

  private draw(angleDeltaRad: number = 0): void {
    this.clearCanvas();
    this.createBaseCircle();

    for (const slice of this.slices) {
      updateSliceAngles(slice, angleDeltaRad);

      if (isCurrentSlice(slice)) {
        this._currentSlice = slice;
        this._onChange?.(slice);
      }
      this.createSlice(slice);
    }
    this.createNeedle();
    this.createCursor();
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

  private fitSliceText(title: string): string {
    const availableWidth = this.radius - this.needleRadius - SLICE_TEXT_NEEDLE_OFFSET;
    const titleWidth = this.context.measureText(title).width;
    const ratio = availableWidth / titleWidth;

    // text too long
    if (ratio <= 1) {
      const shortenedTitle = title.slice(0, Math.floor(title.length * ratio) - 5);
      return `${shortenedTitle}...`;
    }
    return title;
  }

  private createCursor(): void {
    const {
      context,
      center: { x: cx },
    } = this;

    context.lineWidth = CURSOR_LINE_WIDTH;
    context.strokeStyle = STROKE_COLOR;
    context.fillStyle = CURSOR_COLOR;

    context.beginPath();
    context.moveTo(cx - 14, 0);
    context.lineTo(cx, 6);
    context.lineTo(cx + 14, 0);
    context.lineTo(cx, 27);
    context.closePath();
    context.fill();
    context.stroke();
  }

  private createNeedle(): void {
    const {
      context,
      radius,
      center: { x: cx, y: cy },
    } = this;

    context.shadowBlur = SHADOW_BLUR;
    context.shadowColor = SHADOW_COLOR;

    context.beginPath();
    context.arc(cx, cy, radius * NEEDLE_RADIUS_RATIO, 0, PI2);
    context.fillStyle = NEEDLE_COLOR;
    context.lineTo(cx, cy);
    context.fill();
    context.closePath();

    this.context.shadowColor = 'transparent';
  }

  private createBaseCircle(): void {
    const {
      context,
      radius,
      center: { x: cx, y: cy },
    } = this;

    context.shadowBlur = SHADOW_BLUR + 1;
    context.shadowColor = SHADOW_COLOR;
    context.fillStyle = NEEDLE_COLOR;

    context.beginPath();
    context.arc(cx, cy, radius, 0, PI2);
    context.lineTo(cx, cy);
    context.fill();
    context.closePath();

    this.context.shadowColor = 'transparent';
  }

  private createSlice(slice: SliceData): void {
    const { startAngleRad, endAngleRad, color } = slice;
    const {
      context,
      radius,
      center: { x: cx, y: cy },
    } = this;

    const sliceAngleRad = endAngleRad - startAngleRad;

    context.lineWidth = LINE_WIDTH;
    context.strokeStyle = STROKE_COLOR;
    context.fillStyle = color;

    context.beginPath();
    context.moveTo(cx, cy);
    context.arc(cx, cy, radius, startAngleRad, endAngleRad);
    context.closePath();
    context.fill();
    context.stroke();

    // do not display text for too narrow slice
    if (sliceAngleRad >= SLICE_TEXT_VISIBILITY_ANGLE_THRESHOLD) {
      this.createSliceText(slice);
    }
  }

  private createSliceText(slice: SliceData): void {
    const { startAngleRad, endAngleRad, title } = slice;
    const {
      context,
      center: { x: cx, y: cy },
    } = this;

    context.lineWidth = LINE_WIDTH;
    context.fillStyle = SLICE_TEXT_COLOR;
    context.font = SLICE_TEXT_FONT;
    context.textBaseline = SLICE_TEXT_BASELINE;

    context.save();
    context.translate(cx, cy);
    context.rotate((startAngleRad + endAngleRad) / 2);

    slice.sliceText = slice.sliceText || this.fitSliceText(title);

    //context.strokeText(text, this.needleRadius + SLICE_TEXT_NEEDLE_OFFSET, 0);
    context.fillText(slice.sliceText, this.needleRadius + SLICE_TEXT_NEEDLE_OFFSET, 0);
    context.restore();
  }
}
