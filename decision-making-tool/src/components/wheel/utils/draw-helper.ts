import type { SliceData } from '@components';
import { NEEDLE_RADIUS_RATIO, type Wheel } from '@components';
import { PI2 } from './misc.ts';

const CURSOR_LINE_WIDTH = 2;
const LINE_WIDTH = 2;
const SHADOW_BLUR = 4;

const STROKE_COLOR = 'white';
const CURSOR_COLOR = 'rgb(206, 20, 104)';
const SHADOW_COLOR = 'rgb(190 190 190)';
const NEEDLE_COLOR = 'white';

const SLICE_TEXT_NEEDLE_OFFSET = 25;
const SLICE_TEXT_VISIBILITY_ANGLE_THRESHOLD = 0.27;
const SLICE_TEXT_COLOR = 'rgb(40 40 40)';
const SLICE_TEXT_FONT = '16px sans-serif';
const SLICE_TEXT_BASELINE = 'middle';

export class DrawHelper {
  constructor(
    private wheel: Wheel,
    private context: CanvasRenderingContext2D
  ) {}

  public createCursor(): void {
    const { context } = this;
    const {
      center: { x: cx },
    } = this.wheel;

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

  public createNeedle(): void {
    const { context } = this;
    const { radius } = this.wheel;

    context.shadowBlur = SHADOW_BLUR + 1;
    context.shadowColor = SHADOW_COLOR;
    this.createCircle(radius * NEEDLE_RADIUS_RATIO);
    context.shadowColor = 'transparent';
  }

  public createBaseCircle(): void {
    const { context } = this;
    const { radius } = this.wheel;

    context.shadowBlur = SHADOW_BLUR + 1;
    context.shadowColor = SHADOW_COLOR;
    this.createCircle(radius);
    context.shadowColor = 'transparent';
  }

  public createSlice(slice: SliceData, textStroke: number = 0): void {
    const { startAngleRad, endAngleRad, color } = slice;
    const { context } = this;
    const { radius } = this.wheel;

    const sliceAngleRad = endAngleRad - startAngleRad;

    context.lineWidth = LINE_WIDTH;
    context.strokeStyle = STROKE_COLOR;

    this.createCircle(radius - 5, startAngleRad, endAngleRad, color);
    context.stroke();

    // do not display text for too narrow slice
    if (sliceAngleRad >= SLICE_TEXT_VISIBILITY_ANGLE_THRESHOLD) {
      this.createSliceText(slice, textStroke);
    }
  }

  private createCircle(
    radius: number,
    startAngle: number = 0,
    endAngle: number = PI2,
    fillStyle: string = NEEDLE_COLOR
  ): void {
    const { context } = this;
    const {
      center: { x: cx, y: cy },
    } = this.wheel;

    context.fillStyle = fillStyle;

    context.beginPath();
    context.moveTo(cx, cy);
    context.arc(cx, cy, radius, startAngle, endAngle);
    context.closePath();
    context.fill();
  }

  private createSliceText(slice: SliceData, textStroke: number = 0): void {
    const { startAngleRad, endAngleRad, title } = slice;
    const { context } = this;
    const {
      center: { x: cx, y: cy },
      needleRadius,
    } = this.wheel;

    context.fillStyle = SLICE_TEXT_COLOR;
    context.font = SLICE_TEXT_FONT;
    context.textBaseline = SLICE_TEXT_BASELINE;

    context.save();
    context.translate(cx, cy);
    context.rotate((startAngleRad + endAngleRad) / 2);

    slice.shortenedTitle = slice.shortenedTitle || this.shortenSliceTitle(title);

    if (textStroke > 0) {
      context.lineWidth = textStroke;
      context.strokeText(slice.shortenedTitle, needleRadius + SLICE_TEXT_NEEDLE_OFFSET, 0);
    }
    context.fillText(slice.shortenedTitle, needleRadius + SLICE_TEXT_NEEDLE_OFFSET, 0);
    context.restore();
  }

  private shortenSliceTitle(title: string): string {
    const { radius, needleRadius } = this.wheel;

    const availableWidth = radius - needleRadius - SLICE_TEXT_NEEDLE_OFFSET;
    const titleWidth = this.context.measureText(title).width;
    const ratio = availableWidth / titleWidth;

    // text too long
    if (ratio <= 1) {
      const shortenedTitle = title.slice(0, Math.floor(title.length * ratio) - 5);
      return `${shortenedTitle}...`;
    }
    return title;
  }
}
