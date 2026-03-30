export default class CheckpointSystem {
  constructor() {
    this.currentCheckpoint = null;
  }

  setCheckpoint(position) {
    this.currentCheckpoint = { ...position };
  }

  getCheckpoint() {
    return this.currentCheckpoint;
  }

  clear() {
    this.currentCheckpoint = null;
  }
}
