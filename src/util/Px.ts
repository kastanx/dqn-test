export class Px {
  public static pxInSquare: number = 10;

  public static scaleUp(pixels: number): number {
    return pixels * Px.pxInSquare;
  }

  public static scaleDown(square: number): number {
    return square / Px.pxInSquare;
  }
}
