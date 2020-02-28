export class TakenSpots {
  private spots: string[] = [];

  add = (spot: string) => {
    this.spots.push(spot);
  };

  all = (): string[] => {
    return this.spots;
  };
}
