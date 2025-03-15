import { getRndColorMixCss } from '../../utils/index.ts';
import { Element } from '../base/element.ts';
import type { OptionData } from '../option-list/option-list.ts';
import { parseOptionsData } from './helpers.ts';

import styles from './wheel.module.scss';

const NEEDLE_RADIUS_RATIO = 0.1;

const PI2 = Math.PI * 2;
const DEF_WHEEL_RADIUS = 250;
const DEF_WHEEL_DURATION_SECS = 5;
const WHEEL_SPIN_SPEED = 0.00015;
const LINE_WIDTH = 1;
const STROKE_COLOR = 'white';
const CURSOR_POSITION = Math.PI * 1.5;
const CANVAS_PADDING = 20;

const SLICE_TEXT_NEEDLE_OFFSET = 35;
const SLICE_TEXT_VISIBILITY_ANGLE_THRESHOLD = 0.27;
const SLICE_TEXT_COLOR = 'black';
const SLICE_TEXT_FONT = '15px sans-serif';

const ERR_INVALID_CONTEXT =
  'The context id is not supported, or the canvas has already been set to a different context mode';

const ERR_INVALID_OPTIONS_COUNT = 'Invalid options count';

type SliceData = OptionData & {
  startAngleRad: number;
  endAngleRad: number;
  color: string;
};

type Point = { x: number; y: number };

type OnFinishHandler = ((currentSlice: SliceData | null) => void) | null;

type Props = {
  options: OptionData[];
  radius?: number;
  duration?: number;
};

//
// Wheel
//

export class Wheel extends Element<HTMLCanvasElement> {
  private context: CanvasRenderingContext2D;
  private slices: SliceData[] = [];
  private totalWeight: number = 0;
  private _radius: number = 0;
  private _onFinish: OnFinishHandler = null;
  private _currentSlice: SliceData | null = null;

  constructor({ options, radius = DEF_WHEEL_RADIUS }: Props) {
    super({ tag: 'canvas', className: styles.canvas });

    this.radius = radius;
    this.context = this.getContext2D();

    this.validateOptions(options);
    this.createSlicesFromOptions(options);
    this.createNeedle();
    this.createCursor();
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

  public set onFinish(handler: OnFinishHandler) {
    this._onFinish = handler;
  }

  public spin(durationSecs: number = DEF_WHEEL_DURATION_SECS): void {
    const startTime = performance.now();
    let rafId: number;
    let angle = 0;

    if (durationSecs < DEF_WHEEL_DURATION_SECS) {
      durationSecs = DEF_WHEEL_DURATION_SECS;
    }
    const durationMs = durationSecs * 1000;

    const animate = (): void => {
      const elapsed = performance.now() - startTime;
      angle += WHEEL_SPIN_SPEED * (elapsed >= durationMs / 2 ? -1 : 1);

      if (elapsed >= durationMs) {
        this._onFinish?.(this.currentSlice);
        cancelAnimationFrame(rafId);

        return;
      }
      this.draw(angle);
      rafId = requestAnimationFrame(animate);
    };

    animate();
  }

  public refresh(): void {
    this.clearCanvas();

    for (const slice of this.slices) {
      slice.color = getRndColorMixCss();
      this.createSlice(slice);
    }
  }

  private draw(angleDeltaRad: number = 0): void {
    this.clearCanvas();

    for (const slice of this.slices) {
      slice.startAngleRad += angleDeltaRad;
      slice.endAngleRad += angleDeltaRad;

      if (
        CURSOR_POSITION <= slice.endAngleRad % PI2 &&
        CURSOR_POSITION >= slice.startAngleRad % PI2
      ) {
        this._currentSlice = slice;
      }

      this.createSlice(slice);
      this.createNeedle();
      this.createCursor();
    }
  }

  private validateOptions(options: OptionData[]): number {
    const { isValid, totalWeight } = parseOptionsData(options);
    if (!isValid) {
      throw RangeError(ERR_INVALID_OPTIONS_COUNT);
    }
    this.totalWeight = totalWeight;

    return totalWeight;
  }

  private createSlicesFromOptions(options: OptionData[]): void {
    this.clearCanvas();
    this.slices = [];

    let startAngleRad: number = 0;

    for (const item of options) {
      const itemAngleRad = (PI2 * item.weight) / this.totalWeight;
      const endAngleRad = startAngleRad + itemAngleRad;

      const slice = {
        ...item,
        startAngleRad,
        endAngleRad,
        color: getRndColorMixCss(),
      };

      this.createSlice(slice);
      this.slices.push(slice);

      startAngleRad = endAngleRad;
    }
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
      const shortenedTitle = title.slice(0, Math.floor(title.length * ratio) - 2);
      return `${shortenedTitle}...`;
    }
    return title;
  }

  private createCursor(): void {
    const {
      context,
      center: { x: cx },
    } = this;
    context.beginPath();
    context.moveTo(cx - 10, 0);
    context.lineTo(cx, 5);
    context.lineTo(cx + 10, 0);
    context.lineTo(cx, 25);
    context.fillStyle = `rgb(255, 0, 85)`;
    context.fill();
  }

  private createNeedle(): void {
    const {
      context,
      radius,
      center: { x: cx, y: cy },
    } = this;
    context.beginPath();
    context.arc(cx, cy, radius * NEEDLE_RADIUS_RATIO, 0, PI2);
    context.fillStyle = `white`;
    context.lineTo(cx, cy);
    context.fill();
  }

  private createSliceText(slice: SliceData): void {
    const { startAngleRad, endAngleRad, title } = slice;
    const {
      context,
      center: { x: cx, y: cy },
    } = this;

    context.save();
    context.textBaseline = 'middle';
    context.translate(cx, cy);
    context.rotate((startAngleRad + endAngleRad) / 2);

    context.fillStyle = SLICE_TEXT_COLOR;
    context.font = SLICE_TEXT_FONT;

    const slicedTitle = this.fitSliceText(title);
    context.fillText(slicedTitle, this.needleRadius + SLICE_TEXT_NEEDLE_OFFSET, 0);
    context.restore();
  }

  private createSlice(slice: SliceData): void {
    const { startAngleRad, endAngleRad, color } = slice;
    const {
      context,
      radius,
      center: { x: cx, y: cy },
    } = this;

    const sliceAngleRad = endAngleRad - startAngleRad;

    context.beginPath();
    context.lineWidth = LINE_WIDTH;
    context.strokeStyle = STROKE_COLOR;
    context.fillStyle = color;
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
}
