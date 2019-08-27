export default class GlobalListener {
  listeners: any;
  meta: any;
  constructor() {
    this.listeners = {};
    this.meta = {};
  }

  on = (key: string, callback: (...rest: Array<any>) => void) => {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }

    this.listeners[key].push(callback);

    return this;
  };

  do = (key: string, detail: any) => {
    const listeners = this.listeners[key] || [];

    for (let item of listeners) {
      item(detail);
    }

    return this;
  };

  set = (key: string, data: any) => {
    this.meta[key] = Object.assign({}, this.meta[key], data);

    return this;
  };

  getAll = () => {
    return this.meta;
  };

  get = (key: string) => {
    return this.meta[key];
  };

  clear = () => {
    this.meta = {};
  };

  isListenerExist = (name: string) => !!this.listeners[name];
}
