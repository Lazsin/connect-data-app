export const API = {
  PROTOCOL: "http://",
  HOST: "25.61.210.232",
  PORT: "8000",

  get BASE() {
    return `${this.PROTOCOL}${this.HOST}:${this.PORT}`;
  },

  get URL() {
    return `${this.BASE}/api/rest/v2/pipeline/`;
  },

  TOKEN:
    "350a09095fdcb7731b7c26145c0ada3edc026b4e865ff8c0004c95b60cb802c99a1031c3de4a6a394a963aa5c592ff74feb5e76186cfdc995b4a91ede9c5b9e0",
};
