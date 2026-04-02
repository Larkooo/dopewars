// Simple seedable PRNG (xorshift128)
export class Random {
  private state: [number, number, number, number];

  constructor(seed: number) {
    // Initialize state from seed
    this.state = [seed, seed ^ 0xdeadbeef, seed ^ 0xcafebabe, seed ^ 0x12345678];
    // Warm up
    for (let i = 0; i < 20; i++) this.next();
  }

  next(): number {
    let t = this.state[3];
    const s = this.state[0];
    this.state[3] = this.state[2];
    this.state[2] = this.state[1];
    this.state[1] = s;
    t ^= t << 11;
    t ^= t >>> 8;
    this.state[0] = t ^ s ^ (s >>> 19);
    return (this.state[0] >>> 0) / 0x100000000;
  }

  // Random integer in [min, max] inclusive
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Random boolean with given probability
  bool(probability = 0.5): boolean {
    return this.next() < probability;
  }
}
